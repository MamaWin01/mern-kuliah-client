import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSignIn } from "react-auth-kit"


function Login() {
  const [name, setName] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()
  const signIn = useSignIn()
  
  
  const handleSubmit = (e) => {
      e.preventDefault()
      axios.post('http://localhost:8000/api/login', {name, password})
      .then(result => 
          {console.log(result)
              if(result.data ) {
                  signIn({
                    token: result.data.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    AuthState: {name: result.data.name}
    })
        navigate('/home')
                  
              } else {
                  alert('Email or Password is Wrong')
              }
          })
    
      .catch(err=> console.log(err))

  }
  
  
  return(
      <div>
          <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
              <div className="bg-white
               p-3 rounded w-25">
                  <h2>Login</h2>
                  <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                          <label>
                              <strong >Nama</strong>
                          </label>
                          <input 
                              type="text"
                              placeholder="Masukan Nama"
                              autoComplete="off"
                              name="name"
                              className="form-control rounded-0"
                              onChange={(e) => setName(e.target.value)}
                          />
                      </div>
                      <div className="mb-3">
                          <label>
                              <strong>Password</strong>
                          </label>
                          <input 
                              type="password"
                              placeholder="Password?"
                              name="password"
                              className="form-control rounded-0"
                              onChange={(e) => setPassword(e.target.value)}
                          />
                      </div>
                      <button type="submit" className="btn btn-success w-100 rounded-0">
                          Login
                      </button>
                      <div style={{paddingBottom:'5px'}}>
                      </div>
                      <Link to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                          Register
                      </Link>
                  </form> 
              </div>
          </div>  
      </div>
  )
}

export default Login;