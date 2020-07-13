import m from 'mithril'

import './style.scss'
import runtimeArgs from '@/runtime-args'
import $apollo from '@/apollo'
import MUTATION_LOGIN from './login.gql'
import LoginInput from '@/components/login-input'

const PARAM_REDIRECT_URL = 'redirect_url' // 地址中的参数名称

const LoginButtonLabel = {
  LogIn: '登录',
  LoggingIn: '登录中...',
}

const ErrorMsg = {
  UsernameIsEmpty: '请输入用户名',
  PasswordIsEmpty: '请输入密码',
}

const Icon = {
  user: 'user',
  key: 'key',
}

const PlaceholderText = {
  Username: '用户名',
  Password: '密码',
}

const validators = {
  noEmpty: (val, trueMsg = true, falseMsg = false) => Boolean(val) ? trueMsg : falseMsg,
}

export function redirectUrl () {
  const query = m.parseQueryString(window.location.search)
  if (query[PARAM_REDIRECT_URL]) {
    window.location.href = query[PARAM_REDIRECT_URL]
  } else if (process.env.NODE_ENV === 'development') {
    console.info('[ej-login] Successfully logged in. But no redirect url was provided.')
  }
}

export const LoginFormState = {
  username: process.env.NODE_ENV === 'development' ? runtimeArgs.EJ_AUTH_USERNAME : null,
  password: process.env.NODE_ENV === 'development' ? runtimeArgs.EJ_AUTH_PASSWORD : null,
  userErrorMsg: null,
  passwordErrorMsg: null,
  rememberMe: true,
  loading: false,

  get isValidated () {
    return this.userErrorMsg === null && this.passwordErrorMsg === null
  },

  login () {
    this.userErrorMsg = validators.noEmpty(this.username, null, ErrorMsg.UsernameIsEmpty)
    this.passwordErrorMsg = validators.noEmpty(this.password, null, ErrorMsg.PasswordIsEmpty)

    if (!this.isValidated) {
      return
    }

    this.loading = true
    $apollo.mutate({
      mutation: MUTATION_LOGIN,
      variables: {
        input: {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe,
        },
      },
    }).then((data) => {
      redirectUrl()
    }).catch((err) => {
      this.loading = false
      let code = err.graphQLErrors[0].extensions.code
      if (code === '604') {
        this.passwordErrorMsg = '密码错误'
      } else if (code === '603') {
        this.userErrorMsg = '用户名不存在'
      } else if (code === '606') {
        this.userErrorMsg = '当前用户已禁止登录，请联系管理员!'
      } else {
        alert(err.graphQLErrors[0].message)
      }
      m.redraw()
    })
  },
}

export default {
  view () {
    return (
      m('form.login-form', {
          onsubmit: ev => ev.preventDefault(),
        },
        m('div.login-form-title', '登录'),
        m(LoginInput, {
          value: LoginFormState.username,
          placeholder: PlaceholderText.Username,
          type: 'text',
          icon: Icon.user,
          errorMsg: LoginFormState.userErrorMsg,
          validate: val => {
            LoginFormState.userErrorMsg = validators.noEmpty(val, null, ErrorMsg.UsernameIsEmpty)
          },
          oninput: val => {
            LoginFormState.username = val
          },
        }),
        m(LoginInput, {
          value: LoginFormState.password,
          placeholder: PlaceholderText.Password,
          type: 'password',
          icon: Icon.key,
          errorMsg: LoginFormState.passwordErrorMsg,
          validate: val => {
            LoginFormState.passwordErrorMsg = validators.noEmpty(val, null, ErrorMsg.PasswordIsEmpty)
          },
          oninput: val => {
            LoginFormState.password = val
          },
        }),
        m('div.pt20.flex.items-center',
          m('div.flex-1',
            m('label.login-label',
              m('input.login-checkbox', {
                id: 'login-checkbox',
                type: 'checkbox',
                checked: LoginFormState.rememberMe,
                onclick: ({target}) => LoginFormState.rememberMe = target.checked,
              }),
              m('label.login-checkbox-label', {
                for: 'login-checkbox'
              }),
              m('span.login-span-text', {class: LoginFormState.rememberMe ? 'active' : ''}, '7天内自动登陆'),
            ),
          ),
          m('a.forget', {href: 'javascript:'}, '忘记密码？'),
        ),
        m('button.login-button', {
            disabled: LoginFormState.loading,
            onclick: () => LoginFormState.login(),
          },
          LoginFormState.loading ? LoginButtonLabel.LoggingIn : LoginButtonLabel.LogIn,
        ),
      )
    )
  },
}
