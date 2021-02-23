'use strict'
import mongoose from 'mongoose'

/**
 * Form cursor and sort value
 *@example
 *  Usage
 * const cursor = "23894243434234943494" || "5_23894243434234943494"
 * formCursorAndSortValue(cursor)
 * @param {String} cursor
 */
export default function formCursorAndSortValue (cursor) {
  if (!cursor) return {}
  if (mongoose.Schema.Types.ObjectId.isValid(cursor)) {
    return {
      after: cursor
    }
  }
  const [sortValue, after] = cursor.split('_')

  return {
    afterSortKey: sortValue,
    after
  }
}
