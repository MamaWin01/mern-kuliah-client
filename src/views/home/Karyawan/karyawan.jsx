import {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Grid, Menu, Typography } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

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


export default function Karyawan() {
    // for refresh page
    const [isChange, setChange] = useState(false)
    // for modal poup yey!
    const [isShowCreate, invokeModalCreate] = useState(false)
    const [isShowEdit, invokeModalEdit] = useState(false)
    // for update
    const [editKaryawan, setEditKaryawan] = useState({
      id:'',
      name: '',
      alamat: '',
      nohp: '',
      gender: '',
      jabatan: '',
      error: '',
    })
    // for create
    const [values, setValues] = useState({
      id:'',
      name: '',
      alamat: '',
      nohp: '',
      gender: '',
      jabatan: '',
      error: '',
      signedIn: false,
    })
    // token
    const token = auth.isAuthenticated().token;
    // for data and navigate
    const Navigate = useNavigate()
    const [Karyawan, setKaryawan] = useState(Array)
    const [Jabatan, setJabatan] = useState(Array)

    async function initModal(data, type, id='') {
      if(data == 'open') {
        if(type == 'create') {
          return invokeModalCreate(!false)
        } else {
          try {
            let data = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan/`+id, {
              method: 'get',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            })
            data.json().then(data => {
              if(data) {
                setEditKaryawan({'error':'', 
                'name':(data.name || ''), 
                'alamat':(data.alamat || ''), 
                'nohp':(data.nohp || ''), 
                'gender':(data.gender || ''), 
                'id':(data.id || ''), 
                'jabatan':(data.jabatan.id || ''),})
                return invokeModalEdit(!false)  
              }
            })
          } catch (err) {
            console.log(err)
          }
        }
      } else {
        if(type == 'create') {
          setValues({'error':''})
          return invokeModalCreate(false)
        } else {
          setEditKaryawan({'error':''})
          return invokeModalEdit(false)
        }
      }
    }
    // for validation and jabatan
    useEffect(() => {
        async function getData() {
            try {
                let data = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan`, {
                  method: 'get',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  }
                })
                data.json().then(data => {
                    if(data.result){
                        setKaryawan(data.result)
                        setChange(false)
                    }
                })
              } catch (err) {
                console.log(err)
              }
        }

        async function getJabatan() {
          try {
            let data = await fetch(`${import.meta.env.VITE_API_URL}/api/jabatan`, {
              method: 'get',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            })
            data.json().then(data => {
                if(data.result){
                    setJabatan(data.result)
                    setChange(false)
                }
            })
          } catch (err) {
            console.log(err)
          }
        }

        getData()
        getJabatan()
    }, [token, isChange])

    // column for grid table
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1, align:"center", headerAlign:"center" },
      { field: 'name', headerName: 'Nama Karyawan', flex: 1, align:"center", headerAlign:"center" },
      { field: 'alamat', headerName: 'Alamat', flex: 1, align:"center", headerAlign:"center" },
      { field: 'nohp', headerName: 'No Hp', flex: 1, align:"center", headerAlign:"center" },
      { field: 'gender', headerName: 'Gender', flex: 1, align:"center", headerAlign:"center" },
      { field: 'jabatan', headerName: 'Jabatan', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => {
        return (params.row.jabatan.name)
      }},
      { field: 'action', headerName: 'Action', flex: 1, align:"center", headerAlign:"center", filterable: false, sortable: false, renderCell:(params) => 
          { return <ThemeProvider theme={theme}><Button color="success" onClick={() => {initModal("open","edit", params.row.id)}} variant="contained">Edit</Button>
          <Button sx={{marginLeft:"5px"}} color="newDanger" component={Link} onClick={() => {deleteKaryawan(params.row.id)}} variant="contained">Delete</Button></ThemeProvider>
          }}
    ];

    // delete karyawan
    async function deleteKaryawan(id) {
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan/`+id, {
          method: 'delete',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
        })
        if(response.error) {
          alert('something went wrong')
        } else {
          setChange(true)
        }
      } catch (err) {
        console.log(err)
      }
    }

    // create karyawan
    async function handleCreate(event) {
      event.preventDefault();
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan`, {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
          body:JSON.stringify(values)
        })
        await response.json().then(res => {
          if(res.error) {
            setValues({'error':res.error, 'name':(res.data.name || ''), 'alamat':(res.data.alamat || ''), 'nohp':(res.data.nohp || ''), 'gender':(res.data.gender || ''), 'jabatan':(res.data.jabatan || '')})
          } else {
            setChange(true)
            initModal("close","create")
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    // update karyawan
    async function handleUpdate(event) {
      event.preventDefault();
      console.log(editKaryawan);
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/karyawan/`+(editKaryawan.id || editKaryawan.backupid), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
          body:JSON.stringify(editKaryawan)
        })
        await response.json().then(res => {
          if(res.error) {
            console.log(res.error)
            setEditKaryawan({'error':res.error, 'name':(res.data.name || ''), 'alamat':(res.data.alamat || ''), 'nohp':(res.data.nohp || ''), 'gender':(res.data.gender || ''), 'jabatan':(res.data.jabatan || ''), 'backupid':(res.data.backupid || '')})
          } else {
            setChange(true)
            initModal("close","edit")
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    // for change value
    const handleChange = (name,type) => event => {
      if(type == 'edit') {
        setEditKaryawan({...editKaryawan, [name]: event.target.value })
      } else {
        setValues({...values, [name]: event.target.value })
      }
    }
    return(
        <div>
            <Grid container spacing="1">
                <Grid item xs={8}>
                <Typography sx={{ textAlign: 'left' }}>
                    Data Karyawan
                </Typography>
                </Grid>
                <Grid item xs={4}>
                <Button  onClick={() => {initModal("open","create")}} variant="contained" sx={{ float: 'right' }}>Tambah Data</Button>
                </Grid>
            </Grid>
            <Table data={Karyawan} columns={columns}/>
            <div className="modal show" style={{ display: 'block', position: 'initial' }}>
              <Modal show={isShowCreate} style={{marginTop:"190px"}}>
                <Modal.Header closeButton onClick={() => {initModal("close","create")}}>
                  <Modal.Title>Tambah Karyawan Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleCreate}>
                  <div className="mb-3" >
                      <TextField label = "Nama Karyawan"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="name"
                          id="name"
                          className="form-control rounded-0"
                          onChange={handleChange('name','create')}
                      />
                  </div>
                  <div className="mb-3">
                      <TextField label = "Alamat"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="alamat"
                          id="alamat"
                          className="form-control rounded-0"
                          onChange={handleChange('alamat','create')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "No Hp"
                          type="text"
                          placeholder=""
                          name="nohp"
                          id="nohp"
                          className="form-control rounded-0"
                          onChange={handleChange('nohp','create')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Gender"
                          type="text"
                          placeholder=""
                          name="gender"
                          id="gender"
                          className="form-control rounded-0"
                          onChange={handleChange('gender','create')}
                      />
                  </div>
                  <div className="mb-3" >
                    <FormControl sx={{ width:"100%"}}>
                      <InputLabel id="demo-simple-select-helper-label">Jabatan</InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label="jabatan"
                          onChange={handleChange('jabatan','create')}
                        >
                          {(Jabatan || []).map(data => {
                            return <MenuItem key={data.id} value={data.id} inputvalue={data.id}>{data.name}</MenuItem>
                          })}
                        </Select>
                    </FormControl>
                  </div>
                  {
                      values.error ? 
                          <Stack sx={{ width: '100%',marginBottom:'5px' }} spacing={2}>
                              <Alert severity="error">{values.error}</Alert>
                          </Stack>
                      :
                          ''
                  }
                  <div style={{paddingBottom:'15px',width:'20%',margin:'auto'}}>
                      <Button type='submit' variant="contained" className="btn btn-success w-100 rounded-0">Submit</Button>
                  </div>
                  </form> 
                </Modal.Body>
              </Modal>
              <Modal show={isShowEdit} style={{marginTop:"190px"}}>
                <Modal.Header closeButton onClick={() => {initModal("close","edit")}}>
                  <Modal.Title>Edit Karyawan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleUpdate}>
                  <div className="mb-3" >
                      <input type="hidden" value={editKaryawan.id} name="id"/>
                      <TextField label = "Nama Karyawan"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="name"
                          id="name"
                          className="form-control rounded-0"
                          defaultValue={editKaryawan.name}
                          onChange={handleChange('name','edit')}
                      />
                  </div>
                  <div className="mb-3">
                      <TextField label = "Alamat"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="alamat"
                          id="alamat"
                          className="form-control rounded-0"
                          defaultValue={editKaryawan.alamat}
                          onChange={handleChange('alamat','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "No Hp"
                          type="text"
                          placeholder=""
                          name="nohp"
                          id="nohp"
                          className="form-control rounded-0"
                          defaultValue={editKaryawan.nohp}
                          onChange={handleChange('nohp','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Gender"
                          type="text"
                          placeholder=""
                          name="gender"
                          id="gender"
                          className="form-control rounded-0"
                          defaultValue={editKaryawan.gender}
                          onChange={handleChange('gender','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                    <FormControl sx={{ width:"100%"}}>
                      <InputLabel id="demo-simple-select-helper-label">Jabatan</InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          id="demo-simple-select-helper"
                          label="jabatan"
                          value={editKaryawan.jabatan}
                          onChange={handleChange('jabatan','edit')}
                        >
                          {(Jabatan || []).map((data) => {
                            return <MenuItem key={data.id} value={data.id} inputvalue={data.id}>{data.name}</MenuItem>
                          })}
                        </Select>
                    </FormControl>
                  </div>
                  {
                      editKaryawan.error ? 
                          <Stack sx={{ width: '100%',marginBottom:'5px' }} spacing={2}>
                              <Alert severity="error">{editKaryawan.error}</Alert>
                          </Stack>
                      :
                          ''
                  }
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
