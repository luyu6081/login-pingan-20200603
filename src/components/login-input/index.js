import m from 'mithril'

import './style.scss'
import Icon from '@/components/icon'
import {className} from '@/utils'

export default {
  isFocused: false,

  view ({attrs}) {
    const {
      type,
      value,
      placeholder,
      icon,
      errorMsg,
      validate = () => {},
      oninput,
    } = attrs

    return (
      m('div.login-item', {
          class: className(this.isFocused && 'is-focus'),
        },
        m('input.login-input', {
          type,
          value,
          placeholder,
          onfocus: () => {
            this.isFocused = true
          },
          onblur: ({target}) => {
            this.isFocused = false
            validate(target.value)
          },
          oninput: ({target}) => {
            oninput(target.value)
          },
        }),
        m('span.login-span-icon.flex.items-center',
          m(Icon, {
            icon,
            class: 'login-icon',
          }),
        ),
        m('span.login-errmsg', errorMsg),
      )
    )
  },
}
