'use strict'
import geopIp from 'geoip-lite'

const getIp = req => {
  var ip =
    req.headers['x-forwarded-for'] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7)
  }
  if (ip === '::1' || ip === '127.0.0.1') {
    ip = '154.160.30.186'
  }
  return ip
}

export default function attachLocation (req, res, next) {
  const ip = getIp(req)
  const geoInfo = geopIp.lookup(ip)
  const mergedUserAgent = { ip, ...geoInfo, ...req.useragent }
  req.useragent = mergedUserAgent
  geoInfo.ip = ip
  req.location = geoInfo
  next()
}
