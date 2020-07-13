import m from 'mithril'

import './style.scss'
import LoginForm from '@/components/login-form'

export default {
  view () {
    return (
      m('div.login-page.h-full.flex.items-center.justify-center', [
        m('div.login-container',
          // m('div.login-title.mb10', '海盒大数据统一登录'),
          m('div.login-title.mb10', '大数据统一登录'),
          m('div.login-main.flex',
            m('div.login-img'),
            m(LoginForm),
          ),
        ),
      ])
    )
  },
}
