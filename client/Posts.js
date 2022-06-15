import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

const Posts = (props) => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        getPosts().catch(() => navigate('/login'))
    }, [])

    const getPosts = async () => {
        const token = localStorage.getItem('sae_token')

        if (!token) {
            throw new Error('no token')
        }

        //setLoading(true)

        const response = await fetch('http://localhost:3000/api/posts', {
            headers: {
                authorization: `Bearer ${token}`,
            },
        })
        const result = await response.json()

        const posts = result.data.posts.map((post) => ({
            header: post.title,
            description: post.content,
        }))
        setPosts(posts)
        //setLoading(false)
    }

    return <Card.Group items={posts} />
}

export default Posts