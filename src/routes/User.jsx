import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom'
import Register from '../register'
import Login from '../login'
import { RequireAuth, useSignOut } from 'react-auth-kit'
import { Container } from '@mui/material'

function User() {
    return (
          <Routes>
            <Route path='/' element={<RequireAuth loginPath='/login'><Home /></RequireAuth>}></Route>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/login' element={<Login />}></Route>
          </Routes>
      )
  }
  
  function Home() {
    const signOut = useSignOut()
    const navigate = useNavigate()

    const logout = () => {
        signOut()
        navigate('/login')
    }

    return (
        <Container>
            <p>test</p>
            <button onClick={logout}>Logout</button>
        </Container>
    )

  }
  export {User, Home}
  