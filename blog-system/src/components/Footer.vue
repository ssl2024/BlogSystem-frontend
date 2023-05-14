<!--
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-12 22:21:56
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-14 15:49:19
 * @Description: 页脚组件
-->
<template>
    <!-- S 页脚组件 -->
    <div class="footer" ref="footer">
        <!-- 页脚内容主体 -->
        <div class="content_main">
            <!-- 网站和作者介绍 -->
            <div class="about_section">
                <h4>网站简介</h4>
                <p>
                    此网站为纯原创，采用了前后端分离的开发模式、模块化和组件化的开发思想，实现了前后端的高度解耦，这样可以更加灵活地对网站进行升级和维护。此网站的前端框架使用了
                    Vue3 来实现用户界面和交互逻辑，采用了 RESTful
                    风格向后端发送请求和获取数据；此网站的后端框架使用了
                    SpringBoot 来处理数据，使用 MySQL 数据库来存储数据。
                </p>
                <h4>关于作者</h4>
                <p>
                    本人是重庆师范大学计算机科学与技术的一名大三学生，写这个项目的目的是为了检验自己对于
                    Vue 和 Java
                    的学习成果同时提升自己的技术水平。让自己能够熟练的使用 Vue
                    和 Java 进行项目开发，同时也能够丰富自己的项目经历。
                </p>
            </div>
            <!-- 联系方式 -->
            <div class="contact_section">
                <h4>联系方式</h4>
                <ul class="contact_list">
                    <li title="QQ">
                        <i class="iconfont icon-QQ"></i><span>2303418053</span>
                    </li>
                    <li title="微信">
                        <i class="iconfont icon-weixin"></i
                        ><span>SSL2303418053</span>
                    </li>
                    <li title="手机">
                        <i class="iconfont icon-phone-fill"></i
                        ><span>15736576364</span>
                    </li>
                    <li title="邮箱">
                        <i class="iconfont icon-youxiang1"></i
                        ><span>slshi2024@163.com</span>
                    </li>
                </ul>
                <h4>关注作者</h4>
                <ul class="follow_list">
                    <li title="GitHub">
                        <a href="https://github.com/ssl2024" target="_blank"
                            ><i class="iconfont icon-github"></i
                        ></a>
                    </li>
                    <li title="掘金">
                        <a
                            href="https://juejin.cn/user/1596966000146621"
                            target="_blank"
                            ><i class="iconfont icon-juejin"></i
                        ></a>
                    </li>
                    <li title="CSDN">
                        <a
                            href="https://blog.csdn.net/m0_51476241"
                            target="_blank"
                            ><i class="iconfont icon-csdn"></i
                        ></a>
                    </li>
                    <li title="开源中国">
                        <a
                            href="https://my.oschina.net/u/6612490"
                            target="_blank"
                            ><i class="iconfont icon-kaiyuan"></i
                        ></a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!-- E 页脚组件 -->
</template>

<script>
import { ref, watch } from 'vue'
export default {
    props: {
        /* html 标签的高度 */
        htmlHeight: {
            type: Number,
            required: true,
        },
    },
    setup(props) {
        /* DOM footer */
        const footer = ref(null)

        watch(
            () => props.htmlHeight,
            () => {
                // 判断 html.height + footer.height + 110(margin-top) 是否大于 浏览器中可见页面区域的高度
                if (
                    props.htmlHeight + footer.value.offsetHeight + 110 >
                    window.innerHeight
                ) {
                    // 大于，footer.bottom = footer.html + 110(margin-top) -->  距离 html 标签有 110px 的 margin-top
                    footer.value.style.bottom =
                        -(footer.value.offsetHeight + 110) + 'px'
                } else {
                    // 小于，footer.bottom = html.height - 浏览器可见页面区域的高度 --> 简单来说就是让 footer 始终贴在页面底部
                    footer.value.style.bottom =
                        props.htmlHeight - window.innerHeight + 'px'
                }
            }
        )

        return {
            footer,
        }
    },
}
</script>

<style lang="scss" scoped="scoped">
/* 页脚组件
----------------------------------------------------------------*/
.footer {
    position: absolute;
    left: 0;
    bottom: -500px;
    width: 100%;
    padding: 30px 0;
    border-top: 1px solid rgba(71, 172, 191, 0.1);
    border-bottom: 1px solid rgba(71, 172, 191, 0.1);
    background-color: rgba($color: #fff, $alpha: 0.28);
    box-shadow: 0 -4px 4px rgb(0 0 0 / 10%), 0 -2px 2px rgb(0 0 0 / 10%);

    /* 页脚 内容 */
    .content_main {
        display: flex;
        width: 1340px;
        margin: 0 auto;
        padding: 0 15px;
        justify-content: space-around;

        /* 页脚 内容--所有h4标题 */
        h4 {
            margin-bottom: 10px;
            font-size: 18px;
            font-weight: 500;
        }

        /* 页脚 内容--所有p标签 */
        p {
            margin-bottom: 10px;
            font-size: 15px;
            text-align: justify;
            line-height: 1.5;
        }

        /* 页脚 内容--关于 */
        .about_section {
            width: 700px;
        }

        /* 页脚 内容--联系方式 */
        .contact_section {
            width: 400px;

            /* 页脚 内容--联系方式(列表) */
            .contact_list {
                /* 页脚 内容--联系方式(列表项) */
                li {
                    margin-bottom: 10px;
                    font-size: 16px;
                    line-height: 1.5;

                    i {
                        margin-right: 10px;
                    }
                }
            }

            /* 页脚 内容--关注(列表) */
            .follow_list {
                display: flex;
                margin-top: 10px;
                align-items: center;

                /* 页脚 内容--关注(列表项) */
                li {
                    margin-right: 10px;
                    /* GItHub */
                    &:nth-child(1) .iconfont {
                        color: #231f20;
                    }
                    /* 掘金 */
                    &:nth-child(2) .iconfont {
                        color: #006cff;
                    }
                    /* CSDN */
                    &:nth-child(3) .iconfont {
                        color: #dd1700;
                    }
                    /* 开源中国 */
                    &:nth-child(4) .iconfont {
                        color: #21b351;
                    }
                }

                /* 页脚 内容--关注(列表项-对应链接) */
                a {
                    display: flex;
                    width: 40px;
                    height: 40px;
                    background-color: #fff;
                    color: #fff;
                    border-radius: 50%;
                    justify-content: center;
                    align-items: center;
                    transition: all 0.3s ease-in-out;
                    &:hover {
                        transform: translateY(-5px);
                    }
                }
            }
        }
    }
}
</style>
