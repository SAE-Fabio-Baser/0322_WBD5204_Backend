import React from "react"
import { Label } from 'semantic-ui-react'
import Img from "../static/bild.jpeg"

const App = () => {
    return (
        <div>
        <Label>Morgen</Label>
            <img src={Img}/>
        </div>
    )
}

export default App