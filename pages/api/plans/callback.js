'use strict'
import customServerHandler from '../../../server/request-handler'
import planService from '../../../server/services/plan'

const upgrade = (req, res) =>
    planService().upgrade(req.query)
        .then(({ url }) => {
            res.redirect(url)
        })

export default customServerHandler({
    handler: upgrade,
})
