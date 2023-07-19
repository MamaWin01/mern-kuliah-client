import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

function Register() {

    const [values, setValues] = useState({
        name: '',
        emai: '',
        password: '',
        error: '',
        signedIn: false,
    })
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
      e.preventDefault()
      axios.post('http://localhost:8000/api/register', values)
        .then(result => {
            console.log(result.data.error)
            if(result.data.error) {
                setValues({'error':result.data.error})
            } else {
                navigate('/login')
            }
      }) .catch(err=> console.log(err))

  }

  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value })
  }

  return (
      
      
    <div>
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <TextField label = "Nama" 
                        type="text"
                        autoComplete="off"
                        name="name"
                        className="form-control rounded-0"
                        onChange={handleChange('name')}
                    />
                </div>
                <div className="mb-3">
                    <TextField label = "Email" 
                        type="text"
                        autoComplete="off"
                        name="email"
                        className="form-control rounded-0"
                        onChange={handleChange('email')}
                    />
                </div>
                <div className="mb-3">
                    <TextField label = "Password" 
                        type="password"
                        autoComplete="off"
                        name="password"
                        className="form-control rounded-0"
                        onChange={handleChange('password')}
                    />
                </div>
                {
                    values.error ? 
                        <Stack sx={{ width: '100%',marginBottom:'5px' }} spacing={2}>
                            <Alert severity="error">{values.error}</Alert>
                        </Stack>
                    :
                        ''
                }
                <button type="submit" className="btn btn-success w-100 rounded-0">
                Register
                </button>
                </form> 

                <p>hev account alredy</p>
                <Link to="/login" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                    Sign in
                </Link>
            </div>
        </div>
    </div>
)
}

export default Register;