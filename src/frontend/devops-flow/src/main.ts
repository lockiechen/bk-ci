import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import bkui from 'bkui-vue'
import bkuiZhCn from 'bkui-vue/dist/locale/zh-cn.esm'
import bkuiEn from 'bkui-vue/dist/locale/en.esm'

import router from './router'
import { getCookies } from './utils/cookie'
import ZhCN from '../../locale/flow/zh-CN.json'
import EnUS from '../../locale/flow/en-US.json'
import JaJP from '../../locale/flow/ja-JP.json'
import { bkTooltips } from 'bkui-vue/lib/directives';

// 导入全局样式
import './styles/variables.css'
import './styles/global.css'
import './styles/utils.css'

// 导入指令
import { clickoutside } from 'bkui-vue/lib/directives'
import { RouterView } from 'vue-router'

// 语言映射配置
const localeAliasMap: Record<string, string> = {
  'zh-CN': 'zh-CN',
  'zh-cn': 'zh-CN',
  'ja-JP': 'ja-JP',
  ja: 'ja-JP',
  zh_CN: 'zh-CN',
  zh_cn: 'zh-CN',
  cn: 'zh-CN',
  'en-US': 'en-US',
  'en-us': 'en-US',
  en: 'en-US',
  us: 'en-US',
  en_US: 'en-US',
  en_us: 'en-US'
}

const bkUiLocaleAliasMap: Record<string, any> = {
  'zh-CN': bkuiZhCn,
  'zh-cn': bkuiZhCn,
  'ja-JP': bkuiEn,
  ja: bkuiEn,
  zh_CN: bkuiZhCn,
  zh_cn: bkuiZhCn,
  cn: bkuiZhCn,
  'en-US': bkuiEn,
  'en-us': bkuiEn,
  en: bkuiEn,
  us: bkuiEn,
  en_US: bkuiEn,
  en_us: bkuiEn
}

// 获取当前语言设置
const cookiesObj = getCookies()
const i18n = createI18n({
  legacy: false,
  locale: localeAliasMap[cookiesObj.blueking_language ?? 'zh-CN'] ?? 'zh-CN' ,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': ZhCN,
    'en-US': EnUS,
    'ja-JP': JaJP,
  },
})

const app = createApp({
  render: () => h(
    'div',
    {
      class: 'devops-flow-app',
    },
    [     
      h(RouterView),
    ]
  ),
})

app.directive('bk-tooltips', bkTooltips);
app.use(createPinia())
app.use(router)
app.use(bkui, {
  locale: bkUiLocaleAliasMap[cookiesObj.blueking_language ?? 'zh-CN'] || bkuiZhCn
})
app.use(i18n)

// 注册指令
app.directive('clickoutside', clickoutside)
app.directive('bk-clickoutside', clickoutside)

app.mount('#app')
