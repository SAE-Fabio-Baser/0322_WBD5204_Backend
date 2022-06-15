import React, { useEffect, useState } from 'react'
import { Card, Grid, Icon, Image } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'

const Music = () => {
    const [playlists, setPlaylists] = useState([])
    const navigate = useNavigate()

    const getPlaylists = async () => {
        const token = localStorage.getItem('sae_token')

        if (!token) {
            throw new Error('no token')
        }

        //setLoading(true)

        const response = await fetch(
            'http://localhost:3000/api/playlistOf/fabiobaser?limit=50',
            {
                headers: {
                    authorization: `Bearer ${token}`,
                },
            }
        )
        const result = await response.json()

        console.log(result.data.items)
        setPlaylists(result.data.items)
        //setLoading(false)
    }

    useEffect(() => {
        getPlaylists().catch(console.error)
    }, [])

    return (
        <Grid>
            <Grid.Row columns={8}>
                {playlists.map((playlist) => (
                    <Card
                        key={playlist.id}
                        style={{ margin: '2rem' }}
                        onClick={() =>
                            navigate('/music/playlist/' + playlist.id)
                        }
                    >
                        <Image
                            src={playlist.images[0].url}
                            wrapped
                            ui={false}
                        />
                        <Card.Content>
                            <Card.Header>{playlist.name}</Card.Header>
                            <Card.Meta>
                                <span className="date">
                                    {playlist.tracks.total} Songs
                                </span>
                            </Card.Meta>
                            <Card.Description>
                                {playlist.description}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            <a href={playlist.owner.external_urls.spotify}>
                                <Icon name="user" />
                                {playlist.owner.display_name}
                            </a>
                        </Card.Content>
                    </Card>
                ))}
            </Grid.Row>
        </Grid>
    )
}

export default Music