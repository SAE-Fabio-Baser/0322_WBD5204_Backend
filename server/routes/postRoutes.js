import withAuth from '../utils/withAuth.js'

export default function definePostRoutes(app, db) {
    const postsCollection = db.collection('posts')

    app.get('/api/posts', async (req, res) => {
        const posts = await postsCollection.find({}).toArray()

        res.send({
            success: true,
            data: {
                posts,
            },
        })
    })

    app.post('/api/posts/create', (req, res) => {
        withAuth(req, res, async (tokenPayload) => {
            const { title = '', content = '' } = req.body

            if (tokenPayload.role < 1) {
                res.send({ success: false, message: 'Insufficient privileges' })
            }

            const newPost = await postsCollection.insertOne({
                title,
                content,
                author: tokenPayload.id,
            })

            res.send({
                success: true,
                data: {
                    newPost,
                },
            })
        })
    })
}
