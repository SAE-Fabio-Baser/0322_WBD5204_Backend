import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

export default function defineRoutes(app, db) {
    app.post('/login', (req, res) => {
        const { username } = req.body

        // TODO: Implement Login

        const token = jwt.sign({ username }, 'secretSae', { expiresIn: '1h' })
        console.log(token)

        res.send({
            success: true,
            data: {
                token,
            },
        })
    })

    app.get('/', (request, response) => {
        response.send('Home')
    })

    // CREATE user
    app.post('/api/users/create', (req, res) => {
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

    // READ users
    app.get('/api/users', (req, res) => {
        const usersColl = db.collection('users')

        usersColl
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
