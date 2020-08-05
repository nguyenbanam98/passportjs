const router = require("express-promise-router")()

const AccountController = require('../controllers/AccountController')

//initPassportLocal()
router.route('/')
    .get(AccountController.getAllAccount)
    .post(AccountController.addAccount)
    
    
router.route('/:accountID')
    .get(AccountController.getAccount)
    .put(AccountController.updateAccount)
    .delete(AccountController.deleteAccount)




module.exports = router