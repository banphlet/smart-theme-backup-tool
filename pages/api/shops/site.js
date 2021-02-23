'use strict'
import customServerHandler from '../../../server/request-handler'
import got from 'got'
import respond from '../../../server/request-handler/respond'

const fetchSiteDetails = (req, res) => got.get(req.query?.url, { responseType: 'text' }).then(response => response.body).then(respond({ res, req, useRaw: true }))


export default customServerHandler({
    handler: fetchSiteDetails,
})
