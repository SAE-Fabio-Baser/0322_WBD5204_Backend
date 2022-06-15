import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Icon, Image, List } from 'semantic-ui-react'
import { useNavigate, useParams } from 'react-router-dom'

const Playlist = () => {
    const { playlistId } = useParams()
    const [playlist, setPlaylist] = useState({})
    const navigate = useNavigate()

    const getPlaylist = async () => {
        const token = localStorage.getItem('sae_token')

        if (!token) {
            throw new Error('no token')
        }

        //setLoading(true)

        const response = await fetch(
            'http://localhost:3000/api/playlist/' + playlistId,
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        )
        const result = await response.json()

        console.log(result.data)
        setPlaylist(result.data)
        //setLoading(false)
    }

    useEffect(() => {
        getPlaylist().catch(console.error)
    }, [])

    return (
        <>
            <Button onClick={() => navigate('/music')}>Back</Button>
            <h1>{playlist?.name}</h1>
            <List>
                {playlist?.tracks?.items.map(({ track }) => (
                    <List.Item key={track.id}>
                        <Image avatar src={track.album.images[0].url} />
                        <List.Content>
                            <List.Header as="a">{track.name}</List.Header>
                            <List.Description as="a">
                                {track.artists
                                    .map((artist) => artist.name)
                                    .join(', ')}
                            </List.Description>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
        </>
    )
}

export default Playlist