import { Link } from "react-router-dom"
import styled from "styled-components"

const HeaderChat = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-around;
   

`
const HeaderNav = styled.nav`
    display: flex;
    gap: 50px;
`
const HeaderLink = styled(Link)`
    text-decoration: none;
    color: #000000;
    font-size: 20px;
    &:hover{
        color:grey
    }
    &:active{
        color: #0000001f;
    }
`

export default function Header() {
    return <HeaderChat>
        <h1>Hello.io</h1>
        <HeaderNav>
            <HeaderLink to='/'>Home</HeaderLink>
            {!localStorage.getItem('user') && <HeaderLink to='/regist'>Register</HeaderLink>}
            {localStorage.getItem('user') && <HeaderLink style={{ color: 'blue' }} to={`/personalRoom?name=${localStorage.getItem('user')}`}>{localStorage.getItem('user')}</HeaderLink>}
        </HeaderNav>
    </HeaderChat>
}