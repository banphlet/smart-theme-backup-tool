'use strict'
import * as get from './get'
import * as update from './update'
import deleteShopAndDetails from './remove'

export default function shopService () {
  return Object.assign({}, { ...get, ...update, deleteShopAndDetails })
}
