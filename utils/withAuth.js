import jwt from 'jsonwebtoken'
import config from '../config.js'

export default function withAuth(req, res, onValidToken) {
    const { authorization = '' } = req.headers

    function sendError(err) {
        res.send({
            success: false,
            message: 'Not Authorized or invalid Token',
            data: {
                error: err,
                authHeader: authorization,
            },
        })
    }

    if (authorization.length < 8) {
        sendError()
    } else {
        const token = authorization.substring(7, authorization.length)

        jwt.verify(token, config.token.secret, (err, decoded) => {
            if (err) {
                console.error(err)
                sendError(err)
            } else {
                onValidToken(decoded)
            }
        })
    }
}
