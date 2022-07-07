import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

import passwordUtil from '../utils/passwordUtil.js'
import createToken from '../utils/createToken.js'
import withAuth from '../utils/withAuth.js'

export default function defineUserRoutes(app, db) {
    const usersCollection = db.collection('users')

    app.post('/login', async (req, res) => {
        const { username = '', password = '' } = req.body

        if (username.length < 3 || password.length < 6) {
            res.send({
                success: false,
                message: 'No credentials or wrong username/password',
            })
            return
        }

        const user = await usersCollection.findOne({ username })

        if (user && passwordUtil.compare(password, user.password)) {
            const token = createToken({
                id: user._id,
                username: user.username,
                role: user.role,
            })

            res.send({
                success: true,
                data: {
                    token,
                },
            })
            return
        }

        res.send({
            success: false,
            message: 'Wrong username or password',
        })
    })

    app.post('/register', async (req, res) => {
        const { username = '', password = '' } = req.body

        if (username.length < 3 || password.length < 6) {
            res.send({
                success: false,
                message: 'Malformed credentials',
            })
            return
        }

        const encryptedPW = passwordUtil.encrypt(password)

        usersCollection
            .insertOne({
                username,
                password: encryptedPW,
                role: 0,
            })
            .then((createdUser) => {
                const token = createToken({
                    id: createdUser.insertedId,
                    username: username,
                    role: 0,
                })

                res.send({
                    success: true,
                    message: 'Successfully registered',
                    data: { user: createdUser, token },
                })
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: 'Username already taken',
                    data: {
                        error: err,
                    },
                })
            })
    })

    app.get('/', (request, response) => {
        response.send('Home')
    })

    // CREATE user
    app.post('/api/users/create', (req, res) =>
        withAuth(req, res, (tokenPayload) => {
            const { username } = req.body
            const usersColl = db.collection('users')

            usersColl
                .insertOne({
                    username,
                })
                .then(() => {
                    res.send({
                        success: true,
                        message: null,
                    })
                })
                .catch((err) => {
                    res.send({
                        success: false,
                        message: 'databaseInsertError',
                        data: {
                            error: err,
                        },
                    })
                })
        })
    )

    // READ users
    app.get('/api/users', (req, res) =>
        withAuth(req, res, (tokenPayload) => {
            const { role } = tokenPayload

            const requiredRole = 2

            if (role < requiredRole) {
                res.send({ success: false, message: 'Insufficient privileges' })
                return
            }

            usersCollection
                .find({})
                .toArray()
                .then((users) => {
                    res.send({
                        success: true,
                        message: null,
                        data: {
                            users,
                        },
                    })
                })
                .catch((err) => {
                    console.error(err)
                    res.send({
                        success: false,
                        message: 'databaseError',
                        data: {
                            error: err,
                        },
                    })
                })
        })
    )

    // READ user by id
    app.get('/api/users/:id', (req, res) => {
        const usersColl = db.collection('users')

        usersColl
            .find({ _id: new ObjectId(req.params.id) })
            .toArray()
            .then((users) => {
                res.send({
                    success: true,
                    message: null,
                    data: {
                        users,
                    },
                })
            })
            .catch((err) => {
                console.error(err)
                res.send({
                    success: false,
                    message: 'databaseError',
                    data: {
                        error: err,
                    },
                })
            })
    })

    // READ users by role
    app.get('/api/usersAboveRole/:roleAbove', (req, res) => {
        const { roleAbove } = req.params
        const { authorization } = req.headers

        const token = authorization.substring(7, authorization.length)
        jwt.verify(token, 'secretSae', function (err, decoded) {
            if (err) {
                res.send({
                    success: false,
                    message: 'Not authorized or invalid token',
                })
            } else {
                const usersColl = db.collection('users')

                usersColl
                    .find({ role: { $gt: Number(roleAbove) } })
                    .toArray()
                    .then((users) => {
                        console.log(users)
                        res.send({
                            success: true,
                            message: null,
                            data: {
                                users,
                            },
                        })
                    })
                    .catch((err) => {
                        console.error(err)
                        res.send({
                            success: false,
                            message: 'databaseFilterError',
                            data: {
                                error: err,
                            },
                        })
                    })
            }
        })
    })

    // UPDATE user
    app.put('/api/users/:id/update', (req, res) => {
        const { id } = req.params
        const updateProps = req.body

        const usersColl = db.collection('users')

        usersColl
            .updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: updateProps,
                }
            )
            .then(() => {
                res.send({
                    success: true,
                    message: null,
                })
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: 'databaseInsertError',
                    data: {
                        error: err,
                    },
                })
            })
    })

    // DELETE user
    app.delete('/api/users/:id', (req, res) => {
        const { id } = req.params
        const usersColl = db.collection('users')

        usersColl
            .deleteOne({
                _id: new ObjectId(id),
            })
            .then(() => {
                res.send({
                    success: true,
                    message: null,
                })
            })
            .catch((err) => {
                res.send({
                    success: false,
                    message: 'databaseDeleteError',
                    data: {
                        error: err,
                    },
                })
            })
    })
}