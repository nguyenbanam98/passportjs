const Account = require('../models/Account.model')
//const JWT = require('jsonwebtoken')

// JWT

// const encodeToken = (userID) => {
//   return JWT.sign({
//     iss: 'Nam Nguyen',
//     sub: userID,
//     iat: new Date().getTime()
//   }, 'mk')
// }

// Get all Account
const getAllAccount = async (req, res, next) => {

    const account = await Account.find({})
    return res.status(200).json({account})
}
// Get Account
const getAccount = async (req, res, next) => {
    const { accountID } = req.params 
    const account = await Account.findById(accountID)
    return res.status(200).json({account})
}

// Create Account
const addAccount = async (req, res, next) => {
    const newAccount = new Account(req.body)
    await newAccount.save()
    return res.status(201).json({account: newAccount})
}

// Update Account 
const updateAccount = async (req, res, next) => {

    const { accountID } = req.params
    const newAccount = req.body
    await Account.findByIdAndUpdate(accountID, newAccount)
    return res.status(200).json({success: true})
}
// Delete Account 
const deleteAccount = async (req, res, next) => {
    const { accountID } = req.params 
    await Account.deleteOne({_id: accountID})
    return res.status(200).json({success: true})
}
// sign in

// const login = async (req, res, next) => {
//   const { username, password } = req.body
//   const account = await Account.findOne({
//     username: username, password: password
//   })
//   if (account) {
//     const token = encodeToken(account._id)
//     return res.status(200).json({
//       success: true,
//       token: token 
//     })
//   }
// }

module.exports = {
    addAccount,
    getAllAccount,
    getAccount,
    deleteAccount,
    updateAccount
}