import { useState } from "react";
import auth from "../../helpers/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthServices from "../../services/AuthServices";

function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({
      name: '',
      password: '',
      error: '',
      signedIn: false,
    })
  
  
    const handleSubmit = (event) => {
        event.preventDefault();

        AuthServices.login(values).then(data => {
          auth.authenticate(data, () => {
            if(data.error){
              setValues({...values, error: data.error})
              alert('password wrong')
            } else {
              navigate('/home')
              setValues({...values, error: '', signedIn: true})
            }
          })
        })
    
      };
    
      const handleChange = name => event => {
        setValues({...values, [name]: event.target.value })
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
                              onChange={handleChange('name')}
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
                              onChange={handleChange('password')}
                          />
                      </div>
                      <button type="submit" className="btn btn-success w-100 rounded-0">
                          Login
                      </button>
                      <div style={{paddingBottom:'5px'}}>
                      </div>
                        <Link component={Link} to="/register" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                            Register
                        </Link>
                  </form> 
              </div>
          </div>  
      </div>
  )
}

export default Login;