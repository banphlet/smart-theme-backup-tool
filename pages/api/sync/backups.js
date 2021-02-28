'use strict'
import customServerHandler from '../../../server/request-handler'
import respond from '../../../server/request-handler/respond'
import themeSync from '../../../server/services/themes-sync'

const fetchBackups = (req, res) =>
  themeSync()
    .fetchBackups(req.query)
    .then(respond({ res, req }))

export default customServerHandler({
  handler: fetchBackups
})
