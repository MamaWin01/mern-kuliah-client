import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../helpers/auth';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
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


    return(
        <div>
            Hello {user.name}, how are you {text} ? 
        </div>
    )
}

export default Home;