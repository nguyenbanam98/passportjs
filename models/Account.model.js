const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;

const AccountsSchema = new Schema({
    username: {
        type: String
      },
    password: {
        type: String
    }
}, {
    collection: 'Account'
});

AccountsSchema.pre('save', async function(next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Generate a password hash (salt + hash)
    const passwordHashed = await bcrypt.hash(this.password, salt)
    // Re-assign password hashed
    this.password = passwordHashed

    next()
  } catch (error) {
    next(error)
  }
})

AccountsSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

const AccountModel = mongoose.model('Account', AccountsSchema);

module.exports = AccountModel




