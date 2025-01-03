import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"


const FormSection = styled.section`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

`
const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 50px;
    background-color: white;
    box-shadow: 0 0 10px gray;
    padding: 20px;
    height: 500px;
    width: 500px;
    border-radius: 20px;
    justify-content: center;
`

const FormInput = styled.input<{ err: boolean }>`
    height: 50px;
    width: 100%;
    border-radius: 20px;
    outline: none;
    border: none;
    font-size: 20px;
    padding: 10px;
    box-shadow:  0 0 5px grey;
    border: 2px solid ${({ err }) => err ? 'red' : 'none'};
`
const FormButton = styled.button`
    height: 50px;
    border-radius: 20px;
    border: none;
    background-color: #2626da;
    
    color: white;
    font-size: 20px;
    font-weight: 600;
`






export default function FormRegist() {
    const [value, setValue] = useState({ username: '', password: '' })
    const [flag, setFlag] = useState(false)
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    useEffect(() => {
        if (value.username && value.password) {
            fetch('http://localhost:3000/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(value)
            }).then((res) => res.json()).then((data) => {
                if (data == 'no') {
                    setErr('This name or password')
                } else if (data == 'yes') {
                    localStorage.setItem('user', `${value.username}`)
                    navigate(`/personalRoom?user=${value.username}`)
                    window.location.reload()
                }
            }).catch(e => console.log(e))

        } else {
            if (flag == true) {
                setErr('Write in all inputs ')
            }
        }
        return () => setFlag(false)
    }, [flag])
    return <FormSection>
        <Form action="#">
            <label style={{ fontSize: '20px' }} htmlFor="name">
                Username:<FormInput err={err ? true : false} value={value.username} onChange={(e) => {
                    setValue({ ...value, username: e.target.value })
                    setErr('')
                }} type="name"></FormInput>

            </label>
            <label style={{ fontSize: '20px' }} htmlFor="password">
                Password:<FormInput err={err ? true : false} value={value.password} onChange={(e) => {
                    setValue({ ...value, password: e.target.value })
                    setErr('')
                }} type="password"></FormInput>
            </label>
            <strong style={{ color: 'red' }}>{err}</strong>
            <FormButton onClick={(e) => {
                e.preventDefault()
                setFlag(true)
            }} type="submit">Register</FormButton>
        </Form>
    </FormSection>
}