import { useState, useEffect } from "react"

export default function FindFriend() {
    const [name, setName] = useState('')
    const [flag, setFlag] = useState(false)
    const [flagFriend, setFlagFriend] = useState('')
    const [peoples, setPeoples] = useState<any[]>([])
    useEffect(() => {
        if (flag == true) {
            fetch('http://localhost:3000/friend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: name })
            }).then(res => res.json()).then(data => {
                setPeoples(data)
            })
        }
        return () => setFlag(false)
    }, [flag])
    useEffect(() => {
        if (flagFriend) {
            fetch('http://localhost:3000/addfriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user: localStorage.getItem('user'), friend: flagFriend })
            }).then(res => res.json()).then(data => {
                console.log(data)
            }).catch(e => console.log(e))
        }

    }, [flagFriend])
    return <section>
        <div></div>
        <section>
            <form action="#">
                <input value={name} onChange={(e) => {
                    setFlagFriend('')
                    setName(e.target.value)
                }} type="text" placeholder="Find friends!" />
                <button onClick={(e) => {
                    e.preventDefault()
                    setFlag(true)
                }} type="submit">Search</button>
            </form>

            <ul>
                {peoples.map((val, i) => <li onClick={() => setFlagFriend(val.username)} key={i}>{val.username}</li>)}
            </ul>
        </section>
        <div></div>
    </section>
}