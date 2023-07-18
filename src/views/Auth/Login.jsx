import { useState } from "react";
import auth from "../../helpers/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthServices from "../../services/AuthServices"; 
import TextField from "@mui/material/TextField";

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
                            <TextField label = "Nama" 
                                type="text"
                                placeholder="Masukan Nama"
                                autoComplete="off"
                                name="name"
                                className="form-control rounded-0"
                                onChange={handleChange('name')}
                            />
                        </div>
                        <div className="mb-3">
                            <TextField label = "Password"
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

{/* <div>
<div style={{margin:"auto",marginTop:"120px",padding:"25px",width:"30%",border:"1px solid black",justifyContent:"center",alignItems:"center",display:"flex",backgroundColor:""}}>
  <div className="mb-3">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <TextField label = "Nama" 
                    type="text"
                    placeholder="Masukan Nama"
                    autoComplete="off"
                    name="name"
                    className="form-control rounded-0"
                    onChange={handleChange('name')}
                />
            </div>
            <div className="mb-3">
                <TextField label = "Password"
                    type="password"
                    placeholder="Password?"
                    name="password"
                    className="form-control rounded-0"
                    onChange={handleChange('password')}
                />
            </div>
            <Button type="submit" variant="contained" className="btn btn-success w-100 rounded-0">
                Login
            </Button>
            <div style={{paddingBottom:'5px'}}>
            </div>
              <Button Link component={Link} to="/register" className="btn btn-success w-100 rounded-0" variant="contained">
                  Register
              </Button>
        </form> 
    </div>
</div>  
</div>
)
} */}