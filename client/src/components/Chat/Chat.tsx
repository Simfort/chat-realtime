import { useContext, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { io } from "socket.io-client"


const socket = io('http://localhost:3000/')

export default function Chat() {
    const [value, setValue] = useState('')
    const [search] = useSearchParams()
    
    const [messages, setMessages] = useState<{ user: string, room: string | null, text?: string }[]>([])
    useEffect(() => {
        socket.emit('message', { room: search.get('group') })
    }, [])
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        })
        return () => { socket.off('message') }
    }, [messages])
    const sendMessage = () => {
        if (value.trim() !== "") {

            socket.emit('message', { user: localStorage.getItem('user'), room: search.get('group'), text: value })
            console.log(messages)
        }
    }
    return <section>
        <ul>
            {messages.map((val, i) => val.text && <li key={i}>{val.user}:{val.text}</li>)}
        </ul>


        <input value={value} onChange={(e) => setValue(e.target.value)} type="text" />
        <button onClick={sendMessage} >send</button>
    </section>
}