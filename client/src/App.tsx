import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Regist from './Pages/Regist'
import PersonalRoom from './Pages/PersonalRoom'
import FindFriend from './components/PersonaRoom/FindFriend'
import Chat from './components/Chat/Chat'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        {!localStorage.getItem('user') && <Route path='/regist' element={<Regist />} />}
        {localStorage.getItem('user') && <Route path={`/personalRoom`} element={<PersonalRoom />} />}
        {localStorage.getItem('user') && <Route path='/friendfind' element={<FindFriend />} />}
        {localStorage.getItem('user') && <Route path='/chat' element={<Chat />} />}

      </Routes>
    </>
  )
}

export default App
