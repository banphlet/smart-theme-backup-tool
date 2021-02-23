'use strict'

import errors from '../../../../lib/errors'

const customError = data => {}

export default {
  limitNaNError: () =>
    errors.throwError({
      name: errors.LimitNotANumber,
      message: 'Limit must be a number'
    })
}
