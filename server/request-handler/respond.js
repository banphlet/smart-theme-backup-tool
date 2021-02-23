'use strict'

import { httpStatusCodes } from './error-handler'

const respond = ({ status = httpStatusCodes.OK, req, res, useRaw = false }) => responseData => {
  const data = responseData?.data ? responseData?.data : responseData

  if (useRaw) return res.send(responseData)

  const metadata = responseData?.metadata
    ? { metadata: responseData.metadata }
    : {}

  res.status(status).json({
    data,
    ...metadata
  })
}

export default respond
