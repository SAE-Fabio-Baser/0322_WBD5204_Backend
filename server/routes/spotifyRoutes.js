import withAuth from '../utils/withAuth.js'

import axios from 'axios'
import qs from 'qs'

export default function defineSpotifyRoutes(app, db) {
    const postsCollection = db.collection('posts')

    const client = {
        id: '4732733044ad40e6808b49285606be2f',
        secret: '3e26b62ff64f4f06b2c9ee5e3a36f147',
    }

    const data = qs.stringify({
        grant_type: 'client_credentials',
    })

    let spotifyAccessToken = null

    const config = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            Authorization: `Basic ${Buffer.from(
                client.id + ':' + client.secret
            ).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data,
    }

    axios(config)
        .then(function (response) {
            console.log(response.data)
            spotifyAccessToken = response.data.access_token
        })
        .catch(function (error) {
            console.log(error)
        })

    app.get('/api/playlist/:playlistId', (req, res) => {
        withAuth(req, res, async (tokenPayload) => {
            const { playlistId = '' } = req.params

            if (tokenPayload.role < 1) {
                res.send({ success: false, message: 'Insufficient privileges' })
            }

            axios
                .get('https://api.spotify.com/v1/playlists/' + playlistId, {
                    headers: {
                        authorization: 'Bearer ' + spotifyAccessToken,
                    },
                })
                .then((response) => {
                    res.send({
                        success: true,
                        data: response.data,
                    })
                })
                .catch((err) => {
                    console.error(err)
                    res.send({
                        success: false,
                        message: 'Error',
                        error: err,
                    })
                })
        })
    })

    app.get('/api/playlistOf/:userId', (req, res) => {
        withAuth(req, res, async (tokenPayload) => {
            const { userId = '' } = req.params

            if (tokenPayload.role < 1) {
                res.send({ success: false, message: 'Insufficient privileges' })
            }

            axios
                .get(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                    headers: {
                        authorization: 'Bearer ' + spotifyAccessToken,
                    },
                })
                .then((response) => {
                    res.send({
                        success: true,
                        data: response.data,
                    })
                })
                .catch((err) => {
                    console.error(err)
                    res.send({
                        success: false,
                        message: 'Error',
                        error: err,
                    })
                })
        })
    })
}