/*
 * @Author: ssl slshi2024@163.com
 * @Date: 2023-04-09 22:48:58
 * @LastEditors: ssl slshi2024@163.com
 * @LastEditTime: 2023-05-20 01:19:28
 * @Description:
 */
import { createApp, defineAsyncComponent } from 'vue'

/* markdown 相关配置 */
import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor'
import '@kangc/v-md-editor/lib/style/codemirror-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
// highlightjs
import hljs from 'highlight.js'
// codemirror 编辑器的相关资源
import Codemirror from 'codemirror'
// mode
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/vue/vue'
// edit
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/matchbrackets'
// placeholder
import 'codemirror/addon/display/placeholder'
// active-line
import 'codemirror/addon/selection/active-line'
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/scroll/simplescrollbars.css'
// style
import 'codemirror/lib/codemirror.css'
VMdEditor.Codemirror = Codemirror
VMdEditor.use(githubTheme, {
    Hljs: hljs,
})

import App from './App.vue'
import router from './router'
import store from './store'
import 'default-passive-events'
import '@/assets/font/iconfont.css' // 引入字体图标

createApp(App)
    .use(store)
    .use(router)
    .use(VMdEditor)
    .component(
        // 按需加载 消息提示框组件
        'message-box',
        defineAsyncComponent(() => import('@/components/MessageBox'))
    )
    .component(
        // 按需加载 分页组件
        'pagination',
        defineAsyncComponent(() => import('@/components/Pagination'))
    )
    .component(
        // 按需加载 默认内容组件
        'default-content',
        defineAsyncComponent(() => import('@/components/DefaultContent'))
    )
    .mount('#app')
