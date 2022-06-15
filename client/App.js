import React, { useState } from 'react'
import { Button, Card, Feed, Form, Input } from 'semantic-ui-react'

const App = () => {

    const [isLoggedIn, setIsLogedIn] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const login = () => {
        console.log(username, password)
        fetch('http://localhost:3000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                if (result.success) {
                    localStorage.setItem('sae_token', result.data.token)
                    setIsLogedIn(true)
                }
            })
            .catch(console.error)
    }
    const logout = () => setIsLogedIn(false)
    const getUsers = async () => {

        const token = localStorage.getItem("sae_token")

        if (!token) return

        setLoading(true)

        const response = await fetch("http://localhost:3000/api/users", {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        const result = await response.json()

        setUsers(result.data.users)
        setLoading(false)
    }

    const logoutBtn = <Button fluid color={'red'} onClick={logout}>Abmelden</Button>
    const loginForm = (<Form>
        <Form.Field inline>
            <label>Username</label>
            <Input fluid placeholder='legend27' value={username}
                   onChange={(e, props) => setUsername(props.value)} />
        </Form.Field>
        <Form.Field inline>
            <label>Password</label>
            <Input fluid type='password' value={password}
                   onChange={(e, props) => setPassword(props.value)} />
        </Form.Field>
        <Form.Field>
            <Button fluid primary onClick={login}>Anmelden</Button>
        </Form.Field>
    </Form>)

    return (
        <div>
            <Card style={{ display: "inline-block", padding: '2rem', margin: "1rem" }}>
                {isLoggedIn ? logoutBtn : loginForm}
            </Card>
            <Card style={{ display: "inline-block", padding: '2rem', margin: "1rem" }}>
                <Button loading={loading} disabled={loading} onClick={getUsers}>Refresh Users</Button>
                {users.map(user => (
                    <Feed>
                        <Feed.Event content={user.username} image={`https://avatar.tobi.sh/${user.username}.svg?text=${user.username.substr(0,2).toUpperCase()}`}/>
                    </Feed>
                ))}
            </Card>
        </div>
    )
}

export default App