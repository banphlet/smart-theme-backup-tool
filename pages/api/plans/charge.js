'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import planService from '../../../server/services/plan'

const createCharge = (req, res) =>
    planService().createCharge(req.body?.shop_id)
        .then(respond({ res, req }))

export default customServerHandler({
    handler: createCharge,
    method: 'POST'
})
