import jwt from 'jsonwebtoken'

import config from '../config.js'

export default function createToken(
    payload = {},
    expiresIn = config.token.defaultExpire
) {
    return jwt.sign(payload, config.token.secret, { expiresIn })
}
