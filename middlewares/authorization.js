const jwt = require('jsonwebtoken')
const User = require('../models/Account.model')

const auth = async(req, res, next) => {
    const token = req.headers['authorization'].split(' ')[1]
    const data = jwt.verify(token,'mk')
    try {
        const user = await User.findOne({ _id: data.sub})
        if (!user) {
            return res.json('ban phai dang nhap')
        }
        req.user = user
        req.token = token
        next()
    } catch (error) {
        res.status(403).json('Invalid token')
    }

}
module.exports = auth