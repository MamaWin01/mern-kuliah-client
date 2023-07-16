import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import auth from '../../helpers/auth';
import { useNavigate, Link } from 'react-router-dom';
import TextField from "@mui/material/TextField";
import AuthServices from '../../services/AuthServices';


function Home() {
    const user = auth.isAuthenticated().user;
    const Navigate = useNavigate()

    const logout = () => {
        auth.clearJWT(() => {
            Navigate('/')
        })
    }

    const [values, setValues] = useState({
        name: user.name,
        email: user.email,
        password: '',
        new_password: '',
        error: '',
        signedIn: false,
      })

    const handleChange = name => event => {
        setValues({...values, [name]: event.target.value })
    }
    
    const token = auth.isAuthenticated().token;
    const handleUpdateUser = (event) => {
        event.preventDefault();

        AuthServices.updateUser(token, values).then(() => {
            logout()
        })
    }

    return(
        <div style={{margin:"auto",width:"50%",border:"1px solid black",justifyContent:"center",alignItems:"center",display:"flex"}}>
            <form onSubmit={handleUpdateUser}>
                <div className="mb-3" style={{width:"80%"}}>
                    <label style={{float:"left"}}>
                        <strong >Nama</strong>
                    </label>
                    <TextField 
                        type="text"
                        placeholder="Masukan Nama"
                        autoComplete="off"
                        name="name"
                        id="name"
                        className="form-control rounded-0"
                        defaultValue={user.name}
                        onChange={handleChange('name')}
                    />
                </div>
                <div className="mb-3" style={{width:"80%"}}>
                    <label style={{float:"left"}}>
                        <strong >Email</strong>
                    </label>
                    <TextField 
                        type="text"
                        placeholder="Masukan Email"
                        autoComplete="off"
                        name="email"
                        id="email"
                        className="form-control rounded-0"
                        defaultValue={user.email}
                        onChange={handleChange('email')}
                    />
                </div>
                <div className="mb-3" style={{width:"80%"}}>
                    <label style={{float:"left"}}>
                        <strong>Password</strong>
                    </label>
                    <TextField 
                        type="password"
                        placeholder="Password"
                        name="password"
                        id="password"
                        className="form-control rounded-0"
                        onChange={handleChange('password')}
                    />
                </div>
                <div className="mb-3" style={{width:"80%"}}>
                    <label style={{float:"left"}}>
                        <strong>New Password</strong>
                    </label>
                    <TextField 
                        type="password"
                        placeholder="New Password"
                        name="new_password"
                        id="new_password"
                        className="form-control rounded-0"
                        onChange={handleChange('new_password')}
                    />
                </div>
                <div style={{paddingBottom:'5px',width:'50%',margin:'auto'}}>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Update
                    </button>
                </div>
            </form> 
        </div>
    )
}

export default Home;