import {useEffect, useState} from 'react'
import { Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Grid, Menu, Typography } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from "@mui/material/TextField";

// for button color
const theme = createTheme({
  status: {
    danger: '#e53e3e',
    success: '#18d618',
  },
  palette: {
    primary: {
      main: '#0971f1',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
    newDanger: {
      main: '#ff0037',
      contrastText: '#fff',
    },
  },
});

// for table grid like datatables
const Table = (props) => {
    return (
      <div style={{ height: 500, width: '100%', marginTop: '30px' }}>
        <DataGrid
          rows={props.data}
          columns={props.columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 100, 200]}
          slots={{ toolbar: GridToolbar }}
        />
      </div>
    );
  }


export default function Kehadiran() {
    // for refresh page
    const [isChange, setChange] = useState(false)
    // for modal poup yey!
    const [isShowEdit, invokeModalEdit] = useState(false)
    // for update
    const [editKehadiran, setEditKehadiran] = useState({
      id:'',
      karyawan: '',
      hadir: '',
      sakit: '',
      izin: '',
    })
    // token
    const token = auth.isAuthenticated().token;
    // for data and navigate
    const [Kehadiran, setKehadiran] = useState(Array)

    async function initModal(data, type, id='') {
      if(data == 'open') {
        if(type == 'create') {
          return invokeModalCreate(!false)
        } else {
          try {
            let data = await fetch(`${import.meta.env.VITE_API_URL}/api/kehadiran/`+id, {
              method: 'get',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            })
            data.json().then(data => {
              if(data) {
                setEditKehadiran(data)
                return invokeModalEdit(!false)  
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
      } else {
        if(type == 'create') {
          return invokeModalCreate(false)
        } else {
          return invokeModalEdit(false)
        }
      }
    }
    // for validation and karyawan
    useEffect(() => {
        async function getData() {
            try {
                let data = await fetch(`${import.meta.env.VITE_API_URL}/api/kehadiran`, {
                  method: 'get',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  }
                })
                data.json().then(data => {
                    if(data.result){
                        setKehadiran(data.result)
                        setChange(false)
                    }
                })
              } catch (err) {
                console.log(err)
              }
        }

        getData()
    }, [token, isChange])

    // column for grid table
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1, align:"center", headerAlign:"center" },
      { field: 'karyawan', headerName: 'Nama Karyawan', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => {
        console.log(params.row)
        return (params.row.karyawan.name)
      }},
      { field: 'hadir', headerName: 'Hadir', flex: 1, align:"center", headerAlign:"center" },
      { field: 'sakit', headerName: 'Sakit', flex: 1, align:"center", headerAlign:"center" },
      { field: 'izin', headerName: 'Izin', flex: 1, align:"center", headerAlign:"center" },
      { field: 'action', headerName: 'Action', flex: 1, align:"center", headerAlign:"center", filterable: false,sortable: false, renderCell:(params) => 
          { return <ThemeProvider theme={theme}><Button color="success" onClick={() => {initModal("open","edit", params.row.id)}} variant="contained">Edit</Button></ThemeProvider>
          }}
    ];

    // update kehadiran
    async function handleUpdate(event) {
      event.preventDefault();
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/kehadiran/`+editKehadiran.id, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
          body:JSON.stringify(editKehadiran)
        })
        if(response.error) {
          alert('something went wrong')
        } else {
          setChange(true)
          initModal("close","edit")
        }
      } catch (err) {
        console.log(err)
      }
    }

    // for change value
    const handleChange = (name,type) => event => {
      if(type == 'edit') {
        if(name == 'hadir' || name == 'sakit' || name == 'izin') {
          if(event.target.value > 31) {
            setEditKehadiran({...editKehadiran, [name]: 31 })
          } else {
            setEditKehadiran({...editKehadiran, [name]: event.target.value })
          }
        } else {
          setEditKehadiran({...editKehadiran, [name]: event.target.value })
        }
      } else {
        setValues({...values, [name]: event.target.value })
      }
    }
    return(
        <div>
            <Grid container spacing="1">
                <Grid item xs={8}>
                <Typography sx={{ textAlign: 'left' }}>
                    Data Kehadiran
                </Typography>
                </Grid>
                <Grid item xs={4}>
                {/* <Button  onClick={() => {initModal("open","create")}} variant="contained" sx={{ float: 'right' }}>Tambah Data</Button> */}
                </Grid>
            </Grid>
            <Table data={Kehadiran} columns={columns}/>
            <div className="modal show" style={{ display: 'block', position: 'initial' }}>
              <Modal show={isShowEdit} style={{marginTop:"190px"}}>
                <Modal.Header closeButton onClick={() => {initModal("close","edit")}}>
                  <Modal.Title>Edit Kehadiran</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                      <input type="hidden" value={editKehadiran.id} name="id"/>
                      <TextField label = "Hadir"
                          type="number"
                          placeholder=""
                          autoComplete="off"
                          name="hadir"
                          id="hadir"
                          InputProps={{
                            inputProps: { min: 0, max: 31 }
                          }}
                          onKeyPress={(event) => {
                            if (event?.key === '-' || event?.key === '+') {
                              event.preventDefault();
                            }
                          }}
                          className="form-control rounded-0"
                          value={editKehadiran.hadir}
                          onChange={handleChange('hadir','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "sakit"
                          type="number"
                          placeholder=""
                          name="sakit"
                          id="sakit"
                          InputProps={{
                            inputProps: { min: 0, max: 31 }
                          }}
                          onKeyPress={(event) => {
                            if (event?.key === '-' || event?.key === '+') {
                              event.preventDefault();
                            }
                          }}
                          className="form-control rounded-0"
                          value={editKehadiran.sakit}
                          onChange={handleChange('sakit','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Izin"
                          type="number"
                          placeholder=""
                          name="izin"
                          id="izin"
                          InputProps={{
                            inputProps: { min: 0, max: 31 }
                          }}
                          onKeyPress={(event) => {
                            if (event?.key === '-' || event?.key === '+') {
                              event.preventDefault();
                            }
                          }}
                          className="form-control rounded-0"
                          value={editKehadiran.izin}
                          onChange={handleChange('izin','edit')}
                      />
                  </div>
                  <div style={{paddingBottom:'15px',width:'20%',marginLeft:'171px',display:'flex'}}>
                      <ThemeProvider theme={theme}>
                        <Button type='submit' variant="contained" className="btn btn-success w-100 rounded-0">Update</Button>
                        <Button sx={{marginLeft:'5px'}} color="newDanger" onClick={() => {initModal("close","edit", )}} variant="contained">Cancel</Button>
                      </ThemeProvider>
                  </div>
                  </form> 
                </Modal.Body>
              </Modal>
            </div>
        </div>
    )
}
