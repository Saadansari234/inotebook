const jwt = require('jsonwebtoken')
const JWT_secret = 'saadisagoodb$oy'

const fetchUser = async (req, res, next) => {
    // get user from jwt token and add id to req object
    const Authtoken = req.header('auth-token')
    if (!Authtoken) {
        return res.status(401).json({ error: "please authenticate using a valid token" })
    }
    
    try {
        const data= jwt.verify(Authtoken,JWT_secret)
        req.user= data.user
        next()
    } catch (error) {
        return res.status(401).json({ error: "please authenticate using a valid token" })
    }
   
}

module.exports = fetchUser