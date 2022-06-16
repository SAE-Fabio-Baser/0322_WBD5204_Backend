import React, { useEffect } from 'react'
import { Label } from 'semantic-ui-react'
import axios from 'axios'

const config = {
    backendUrl:
        'https://sae-fabio-baser-0322-wbd5204-backend-54w6gwvhr49-3000.githubpreview.dev',
}

const App = () => {
    useEffect(() => {
        axios
            .get(config.backendUrl + '/api/posts')
            .then(console.log)
            .catch(console.error)
    }, [])

    return (
        <div>
            <h1>owhjefoi</h1>
        </div>
    )
}

export default App
