import { useContext, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import styled from "styled-components"
import chat from './chat.svg'
import { io } from "socket.io-client"


const socket = io('http://localhost:3000/')

const PersonRoom = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`
const PersonUser = styled.section`
    margin-top: 50px;
    text-align: center;
`
const PersonFriends = styled.section`
    height: 50vh;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    
    align-items: center;
`
const ListFriends = styled.ul`
    width: 100%;
    border: 2px solid black;
    margin-top: 20px;
`
const LinkFind = styled(Link)`
    text-decoration: none;
    width: 150px;
    background-color: #2626da;
    color: white;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    align-self: flex-end;
    font-weight: 700;
    border-radius: 20px;
    &:hover{
        background-color: #2626da65;
    }
    &:active{
        background-color: #2626da9b;
    }
`
const ListFriend = styled.li`
    overflow: hidden;
    border-top: 1px solid gray;
    font-size: 20px;
    display: grid;
    grid-template-columns: 10fr 1fr;
    padding: 10px;
`
const ChatImg = styled(Link)`
    height: 30px;
    cursor: pointer;
    width: 30px;
    background-image: url(${chat});
`

export default function Person() {
    const [friends, setFriends] = useState<string[]>([])
    const [search] = useSearchParams()
    const [user,setUser]=useState('')
    const [messages,setMessages]=useState<{user:string,room:string,text?:string}[]>([])
    const [inpOrOut,setInpOrOut]=useState(false)
    const [count,setCount]=useState(0)
    useEffect(()=>{
        if(messages){
            socket.on('message',(msg)=>{
                setCount(messages.length)
                if(msg.user && msg.text){
                    setInpOrOut(true)
                    setUser(msg.user)
                }
                
                setMessages([...messages,msg])
            
            })
        }
       
    },[messages])
    useEffect(() => {
        fetch('http://localhost:3000/getfriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user: localStorage.getItem('user') })
        }).then((res) => res.json()).then((data) => {
            setFriends(data)
            socket.emit('message',{user:localStorage.getItem('user'),room:search.get('name')})
        }).catch((e) => console.log(e))
    }, [])
    return <PersonRoom>
        <div></div>

        <PersonUser>
            <h1 style={{ fontSize: '30px' }}>{localStorage.getItem('user')}</h1>
            <PersonFriends>
                <h2>Friends</h2>
                <LinkFind to={'/friendfind'}>Find friend</LinkFind>
                <ListFriends>
                    {friends.map((val, i) => val && <ListFriend key={i}>{val}<ChatImg onClick={()=>setCount(0)} to={`/chat?group=${inpOrOut?localStorage.getItem('user'):val}`}><img src={chat} /></ChatImg></ListFriend>)}
                </ListFriends>
            </PersonFriends>
            {count}
        </PersonUser>
        <div></div>
    </PersonRoom>
}