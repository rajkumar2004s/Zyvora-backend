const jwt = require('jsonwebtoken')

const authenticationToken = (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader?.split(' ')[1]
  if (!token) {
    return res.status(401).json({message: 'Access denied no token porvided'})
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({message: 'Token Expired'})
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(403).json({message: 'Token errorring '})
      } else {
        return res.status(400).json({message: 'Token Error'})
      }
    }
    req.user = payload
    next()
  })
}

module.exports = {authenticationToken}
