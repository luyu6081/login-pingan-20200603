import m from 'mithril'

import Icon from '@/components/icon'

export default {
  view () {
    return (
      m('div.h-full.flex.items-center.justify-center', [
        m(Icon, {icon: 'check-circle', class: 'text-blue', style: 'width: 64px; height: 64px;'}),
      ])
    )
  },
}
