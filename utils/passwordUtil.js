import bcrypt from 'bcrypt'

export default {
    encrypt: (password) => {
        const salt = bcrypt.genSaltSync()
        return bcrypt.hashSync(password, salt)
    },
    compare: function (inputPassword, dbPassword) {
        return bcrypt.compareSync(inputPassword, dbPassword)
    },
}
