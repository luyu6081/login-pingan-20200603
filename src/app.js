import m from 'mithril'

import runtimeArgs from '@/runtime-args'
import {thirdParty} from '@/utils' // getUserInfo,
import LoginView from '@/views/login'
import PlaygroundView from '@/views/playground'

// let isLoggedIn = false
const loginFlag = runtimeArgs.EJ_USE_LOGIN_FLAG // true使用自开发登录页  false使用统一第三方登录

m.route.prefix = '#'
m.route(document.body, '/', {
  // '/': LoginView,
  // '/login': LoginView, // backward-compat
  '/': {
    onmatch: function (args, requestedPath) {
      // console.log(11, isLoggedIn)
      if (loginFlag) {
        if (JSON.stringify(args) !== '{}' && !window.location.search) {
          m.route.prefix = ''
          m.route.set('/', args)
        } else {
          return LoginView
        }
      } else {
        thirdParty()
      }
    },
  },
  '/login': {
    onmatch: function (args, requestedPath) {
      if (args) {
        m.route.prefix = ''
        m.route.set('/', args)
      }
    },
  },
  '/playground': PlaygroundView,
})
