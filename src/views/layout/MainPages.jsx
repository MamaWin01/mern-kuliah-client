import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Container } from '@mui/material';
import auth from '../../helpers/auth';
import { useNavigate, Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

function MainPages() {
    const user = auth.isAuthenticated().user;
    const Navigate = useNavigate()
    const [text, setText] = useState()
    useEffect(() => {
        if(user.name == 'nico') {
            setText('budi')
        } else {
            setText('')
        }
    }, [text])

    const logout = () => {
        auth.clearJWT(() => {
            Navigate('/')
        })
    }

    return(
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar sx={{justifyContent:"center"}}>
                <Button style={{color:"white"}} component={Link} to="/home">Home</Button>
                <Button style={{color:"white"}} component={Link} to="/home/karyawan">Karyawan</Button>
                <Button style={{color:"white"}} component={Link} to="/home/jabatan">Jabatan</Button>
                <Button style={{color:"white"}} component={Link} to="/home/kehadiran">Kehadiran</Button>
                <Button style={{color:"white"}} component={Link} to="/home/gaji">Gaji</Button>
                <Button style={{color:"white"}} component={Link} to="/home/profile">Profile</Button>
                <Button style={{color:"white"}} onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
            <Container sx={{justifyContent:"center",marginTop:"25px"}}>
                <Outlet />
            </Container>
        </Box>
    )
}

export default MainPages;