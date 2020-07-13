import m from 'mithril'
import svg4everybody from 'svg4everybody'

import icons from '@ej/ui/src/components/icon/icons.svg'

svg4everybody()

export default {
  view (vnode) {
    const {icon} = vnode.attrs

    return (
      m('svg', {...vnode.attrs, icon: undefined}, [
        m('use', {'xlink:href': icons + '#' + icon}),
      ])
    )
  },
}
