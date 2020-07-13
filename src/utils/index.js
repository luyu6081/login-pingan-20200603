import m from 'mithril'

import runtimeArgs from '@/runtime-args'
import $apollo from '@/apollo'
import GET_USERINFO from '@/graphql/getUserInfo.gql'

export function className (...args) {
  return args.filter(Boolean).join(' ')
}
export async function getUserInfo() {
  let data = await $apollo.query({
    query: GET_USERINFO,
  })
  return data.data.data
}
export function thirdParty () {
  const query = m.parseQueryString(window.location.search)
  let thirdPartyUrl = `${runtimeArgs.EJ_THIRD_PARTY_LOGIN_URL}/bj/cas/authDoLogin?redirect=${encodeURIComponent(query['redirect_url'])}`
  location.href = thirdPartyUrl
}
