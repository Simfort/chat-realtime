import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Regist from './Pages/Regist'
import PersonalRoom from './Pages/PersonalRoom'

function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        {!localStorage.getItem('user') && <Route path='/regist' element={<Regist />} />}
        {!localStorage.getItem('user') && <Route path='/personalRoom' element={<PersonalRoom />} />}
      </Routes>
    </>
  )
}

export default App
