import 'unfetch/polyfill/index' // https://github.com/developit/unfetch/issues/101

import '@/assets/css/base.scss'
import {getRuntimeArgs} from './runtime-args'

getRuntimeArgs().then(() => {require('./app')})
