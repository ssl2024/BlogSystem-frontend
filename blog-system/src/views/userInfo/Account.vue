<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 11:51:43
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-20 00:38:11
 * @Description: 用户信息页-账号设置模块
-->
<template>
    <!-- S 账号设置模块 -->
    <div class="account_setting">
        <!-- 标题 -->
        <div class="setting_title">账号设置</div>
        <!-- 设置列表项 -->
        <ul class="setting_list">
            <!-- 手机 -->
            <li class="setting_item">
                <span>手机</span>
                <span>未绑定</span>
                <span @click="bindTel">绑定</span>
            </li>
            <!-- 邮箱 -->
            <li class="setting_item">
                <span>邮箱</span>
                <span>未绑定</span>
                <span @click="bindEmail">绑定</span>
            </li>
            <!-- 密码 -->
            <li class="setting_item">
                <span>密码</span>
                <span></span>
                <span @click="isShowResetPwd = true">修改</span>
            </li>
        </ul>
        <!-- 重置密码表单 -->
        <form class="reset_form" v-if="isShowResetPwd">
            <!-- 没用的 input，但是缺少就会有警告 -->
            <input v-show="false" autocomplete="username" />
            <!-- 表头 -->
            <div class="header">
                <span>修改密码</span>
                <i
                    class="iconfont icon-close"
                    @click="isShowResetPwd = false"
                    title="关闭"
                ></i>
            </div>
            <!-- 当前密码 -->
            <div class="current_pwd">
                <input
                    type="password"
                    placeholder="请输入原密码"
                    v-model.trim="currentPwd"
                    autocomplete="current-password"
                    onpaste="return false;"
                />
            </div>
            <!-- 新密码 -->
            <div class="new_pwd">
                <input
                    type="password"
                    placeholder="输入新密码"
                    v-model.trim="newPwd"
                    @change="changePwdState"
                    autocomplete="new-password"
                    onpaste="return false;"
                />
                <i
                    v-show="pwdTips === 'success'"
                    class="iconfont icon-success"
                ></i>
                <i
                    v-show="pwdTips === 'warn'"
                    class="iconfont icon-warning"
                ></i>
            </div>
            <!-- 确认密码 -->
            <div class="renew_pwd">
                <input
                    type="password"
                    placeholder="确认新密码"
                    v-model.trim="reNewPwd"
                    @change="changePwdState"
                    autocomplete="new-password"
                    onpaste="return false;"
                />
                <i
                    v-show="pwdTips === 'success'"
                    class="iconfont icon-success"
                ></i>
                <i
                    v-show="pwdTips === 'warn'"
                    class="iconfont icon-warning"
                ></i>
            </div>
            <div class="btn" @click="changePwd" :placeholder="pwdPlaceholder">
                修改密码
            </div>
        </form>
    </div>
    <!-- E 账号设置模块 -->
</template>

<script>
import { reactive, toRefs } from 'vue'

import http from '@/utils/http'
import md5 from 'md5'
export default {
    setup(_, { emit }) {
        const data = reactive({
            /* 当前密码 */
            currentPwd: '',
            /* 新密码 */
            newPwd: '',
            /* 确认密码 */
            reNewPwd: '',
            /**
             * 是否显示重置密码框
             * true  显示
             * false 不显示
             */
            isShowResetPwd: false,
            /**
             * 密码状态提示
             * success 成功
             * warn    警告
             */
            pwdTips: '',
            /* 提示信息 */
            pwdPlaceholder: '',
        })

        /**
         * 正则表达式判断
         * param1 需要判断的字符串
         * param2 正则表达式
         * param3 字符串的最大长度(可选)
         * return 布尔值
         *  */
        const matches = (str, reg, maxLen = -1) => {
            // 没有指定最大长度
            if (maxLen == -1) {
                return reg.test(str)
            } else {
                return reg.test(str) && str.length < maxLen
            }
        }

        /* change 密码框 */
        const changePwdState = () => {
            if (data.newPwd.length == 0 || data.reNewPwd.length == 0) {
                // 两个密码框有一个为空
                return
            }
            if (data.newPwd != data.reNewPwd) {
                // 两次密码不一致
                data.pwdTips = 'warn'
                data.pwdPlaceholder = '两次密码不一致'
                return
            }
            // 判断账号是否符合要求(6-16位字母数字.)
            if (matches(data.reNewPwd, /[a-zA-Z0-9]{6,16}/, 16)) {
                // 正则验证通过
                data.pwdTips = 'success'
                data.pwdPlaceholder = ''
            } else {
                // 正则验证失败
                data.pwdTips = 'warn'
                data.pwdPlaceholder = '密码只能包含6-16位字母数字或小数点'
            }
        }

        /* click 绑定(手机) */
        const bindTel = () => {
            emit('showMessageBox', {
                message: '暂不支持绑定手机，努力开发中',
                type: 'error',
            })
        }
        /* click 绑定(邮箱) */
        const bindEmail = () => {
            emit('showMessageBox', {
                message: '暂不支持绑定邮箱，努力开发中',
                type: 'error',
            })
        }
        /* click 修改密码 */
        const changePwd = () => {
            // 判断输入输入原密码
            if (data.currentPwd.length === 0) {
                return emit('showMessageBox', {
                    message: '请输入原密码',
                    type: 'warning',
                })
            }
            // 判断两次密码是否符合要求
            if (data.pwdTips != 'success') {
                return emit('showMessageBox', {
                    message: '密码不符合规则，请修改',
                    type: 'warning',
                })
            }
            // 更新用户密码
            updateUserPwd(md5(data.currentPwd), md5(data.newPwd)).then(res => {
                if (res.data.code === 20031) {
                    emit('showMessageBox', {
                        message: '密码更新成功',
                        type: 'success',
                    })
                    // 关闭密码框
                    data.isShowResetPwd = false
                    // 清空输入框
                    data.currentPwd = ''
                    data.newPwd = ''
                    data.reNewPwd = ''
                    // 隐藏提示图标
                    data.pwdTips = ''
                } else {
                    emit('showMessageBox', {
                        message: res.data.msg,
                        type: 'error',
                    })
                    // 清空输入框
                    data.currentPwd = ''
                    data.newPwd = ''
                    data.reNewPwd = ''
                    // 隐藏提示图标
                    data.pwdTips = ''
                }
            })
        }

        /* http 更新用户信息 */
        const updateUserPwd = (oldPwd, newPwd) => {
            return http.put(`/users/update`, { oldPwd, newPwd })
        }
        return {
            ...toRefs(data),
            bindTel,
            bindEmail,
            changePwd,
            changePwdState,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 边框分隔线颜色 */
$border_line: rgba(
    $color: #b3e2f2,
    $alpha: 1,
);

/* 用户信息页--账号设置模块 
----------------------------------------------------------------*/
.account_setting {
    position: relative;
    width: 100%;
    height: 100%;
    /* 账号设置 标题 */
    .setting_title {
        height: 55px;
        border-bottom: 1px solid $border_line;
        font-size: 22px;
        font-weight: 600;
        line-height: 55px;
    }

    /* 账号设置 列表 */
    .setting_list {
        height: 55px;
        font-size: 14px;
        line-height: 55px;

        /* 账号设置 列表--列表项 */
        .setting_item {
            display: flex;
            border-bottom: 1px solid $border_line;
            justify-content: space-around;
            :nth-child(1) {
                width: 80px;
            }
            :nth-child(2) {
                flex: 1;
                color: #666;
            }
            :nth-child(3) {
                width: 40px;
                color: rgba($color: #1989fa, $alpha: 0.8);
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                    color: rgba($color: #0080ff, $alpha: 1);
                }
            }
        }
    }

    /* 账号设置 重置表单 */
    .reset_form {
        position: absolute;
        top: 50%;
        left: 50%;
        padding: 30px 25px;
        background-color: rgba($color: #b6e4f4, $alpha: 0.7);
        transform: translate(-50%, -50%);

        /* 所有字体图标 */
        .iconfont {
            position: absolute;
            top: 8px;
            right: 12px;
            font-size: 18px;

            /* 成功样式 */
            &.icon-success {
                color: #52c41a;
            }

            /* 警告样式 */
            &.icon-warning {
                color: #faad14;
            }
        }

        /* 表头 */
        .header {
            display: flex;
            position: relative;
            padding: 0 10px;
            font-size: 18px;
            font-weight: 600;
            justify-content: space-between;

            /* 表头关闭图标 */
            .icon-close {
                position: absolute;
                top: 0;
                right: 0;
                color: #757575;
                cursor: pointer;
            }
        }

        /* 密码框外层div */
        [class$='pwd'] {
            position: relative;
            margin-top: 12px;
        }

        /* 所有密码框 */
        [type='password'] {
            width: 248px;
            height: 18px;
            padding: 10px 10px 10px 15px;
            border: 1px solid rgba($color: #56a6bd, $alpha: 0.7);
            color: #757575;
            font-size: 14px;
            // border-radius: 5px;
            outline: none;
            &:hover {
                border: 1px solid rgba($color: #56a6bd, $alpha: 1);
            }
        }

        /* 当前密码 */
        .current_pwd {
            margin-top: 20px;
        }

        /* 修改密码按钮 */
        .btn {
            position: relative;
            width: 275px;
            height: 40px;
            margin-top: 25px;
            background-color: #45b8cc;
            color: #fff;
            font-size: 15px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            border-radius: 5px;

            /* 注册 表单--密码框(提示信息) */
            &::before {
                content: attr(placeholder);
                position: absolute;
                top: -29px;
                left: 15px;
                height: 30px;
                color: rgba($color: red, $alpha: 0.9);
                font-size: 12px;
                line-height: 30px;
            }
        }
    }
}
</style>
