import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../helpers/auth';
import { useNavigate, Link } from 'react-router-dom';

function Home() {
    const user = auth.isAuthenticated().user;
    const Navigate = useNavigate()
    const [text, setText] = useState()
    const [img, setImg] = useState()
    useEffect(() => {
        if(user.name == 'nico') {
            setText('budi')
        } else if(user.name == 'vin') {
            setImg('/esteregg.gif')
        } else {
            setText('')
        }
    }, [text, img])


    return(
        <div>
            Hello {user.name}, how are you {text} ? 
            <div>
                <img src={img} className="img-fluid" alt="" />
            </div>
        </div>
    )
}

export default Home;