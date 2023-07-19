import {useEffect, useState} from 'react'
import { Modal } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { numberFormat } from '../../../helpers/number'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Grid, Typography } from "@mui/material"
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from "@mui/material/TextField";
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

function Jabatan() {
    // for refresh page
    const [isChange, setChange] = useState(false)
    // for modal poup yey!
    const [isShowCreate, invokeModalCreate] = useState(false)
    const [isShowEdit, invokeModalEdit] = useState(false)
    // for update
    const [editJabatan, setEditJabatan] = useState({
      id:'',
      name: '',
      pokok: '',
      transportasi: '',
      makan: '',
      error: '',
    })
    // for create
    const [values, setValues] = useState({
      name: '',
      pokok: '',
      transportasi: '',
      makan: '',
      error: '',
      signedIn: false,
    })
    // token
    const token = auth.isAuthenticated().token;
    // for data and navigate
    const Navigate = useNavigate()
    const [Jabatan, setJabatan] = useState(Array)

    async function initModal(data, type, id='') {
      if(data == 'open') {
        if(type == 'create') {
          return invokeModalCreate(!false)
        } else {
          try {
            let data = await fetch(`${import.meta.env.VITE_API_URL}/api/jabatan/`+id, {
              method: 'get',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            })
            data.json().then(data => {
              if(data) {
                setEditJabatan(data)
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
          setEditJabatan({'error':''})
          return invokeModalEdit(false)
        }
      }
    }
    // for validation
    useEffect(() => {
        async function getData() {
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
    }, [token, isChange])

    // column for grid table
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1, align:"center", headerAlign:"center" },
      { field: 'name', headerName: 'Nama Jabatan', flex: 1, align:"center", headerAlign:"center" },
      { field: 'pokok', headerName: 'Gaji Pokok', flex: 1, align:"center", headerAlign:"center" , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'transportasi', headerName: 'Biaya Transportasi', flex: 1, align:"center", headerAlign:"center" , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'makan', headerName: 'Uang Makan', flex: 1, align:"center", headerAlign:"center" , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'total', headerName: 'Total', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) =>
          { return 'Rp ' + numberFormat(parseInt(params.row.pokok.replace(/\,/g, '')) + parseInt(params.row.transportasi.replace(/\,/g, '')) + parseInt(params.row.makan.replace(/\,/g, '')))} },
      { field: 'action', headerName: 'Action', flex: 1, align:"center", headerAlign:"center", filterable:false,sortable: false, renderCell:(params) => 
          { return <ThemeProvider theme={theme}><Button color="success" onClick={() => {initModal("open","edit", params.row.id)}} variant="contained">Edit</Button>
          <Button sx={{marginLeft:"5px"}} color="newDanger" component={Link} onClick={() => {deleteJabatan(params.row.id)}} variant="contained">Delete</Button></ThemeProvider>
          }}
    ];

    // delete jabatan
    async function deleteJabatan(id) {
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/jabatan/`+id, {
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

    // create jabatan
    async function handleCreate(event) {
      event.preventDefault();
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/jabatan`, {
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
            setValues({'error':res.error, 'name':(res.data.name || ''), 'pokok':(res.data.pokok || ''), 'transportasi':(res.data.transportasi || ''), 'makan':(res.data.makan || '')})
          } else {
            setChange(true)
            initModal("close","create")
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    // update jabatan
    async function handleUpdate(event) {
      event.preventDefault();
      try {
        let response = await fetch(`${import.meta.env.VITE_API_URL}/api/jabatan/`+(editJabatan.id || editJabatan.backupid), {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer "+token
          },
          body:JSON.stringify(editJabatan)
        })
        await response.json().then(res => {
          if(res.error) {
            setEditJabatan({'error':res.error, 'name':(res.data.name || ''), 'pokok':(res.data.pokok || ''), 'transportasi':(res.data.transportasi || ''), 'makan':(res.data.makan || ''), 'backupid':(res.data.backupid || '')})
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
      if(name == 'pokok' || name == 'transportasi' || name == 'makan') {
        event.target.value = numberFormat(event.target.value)
        if(event.target.value == '0') {
          event.target.value = "";
        }
        if(type == 'edit') {
          setEditJabatan({...editJabatan, [name]: event.target.value })
        } else {
          setValues({...values, [name]: event.target.value })
        }
      } else {
        if(type == 'edit') {
          setEditJabatan({...editJabatan, [name]: event.target.value })
        } else {
          setValues({...values, [name]: event.target.value })
        }
      }
    }
    return(
        <div>
            <Grid container spacing="1">
                <Grid item xs={8}>
                <Typography sx={{ textAlign: 'left' }}>
                    Data Jabatan
                </Typography>
                </Grid>
                <Grid item xs={4}>
                <Button  onClick={() => {initModal("open","create")}} variant="contained" sx={{ float: 'right' }}>Tambah Data</Button>
                </Grid>
            </Grid>
            <Table data={Jabatan} columns={columns}/>
            <div className="modal show" style={{ display: 'block', position: 'initial' }}>
              <Modal show={isShowCreate} style={{marginTop:"190px"}}>
                <Modal.Header closeButton onClick={() => {initModal("close","create")}}>
                  <Modal.Title>Tambah Jabatan Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleCreate}>
                  <div className="mb-3" >
                      <TextField label = "Nama Jabatan"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="name"
                          id="name"
                          className="form-control rounded-0"
                          value={values.name}
                          defaultValue={values.name}
                          onChange={handleChange('name','create')}
                      />
                  </div>
                  <div className="mb-3">
                      <TextField label = "Gaji Pokok"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="pokok"
                          id="pokok"
                          className="form-control rounded-0"
                          value={values.pokok}
                          defaultValue={values.pokok}
                          onChange={handleChange('pokok','create')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Biaya Transportasi"
                          type="text"
                          placeholder=""
                          name="transportasi"
                          id="transportasi"
                          className="form-control rounded-0"
                          value={values.transportasi}
                          defaultValue={values.transportasi}
                          onChange={handleChange('transportasi','create')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Uang Makan"
                          type="text"
                          placeholder=""
                          name="makan"
                          id="makan"
                          className="form-control rounded-0"
                          value={values.makan}
                          defaultValue={values.makan}
                          onChange={handleChange('makan','create')}
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
                  <div style={{paddingBottom:'15px',width:'20%',margin:'auto'}}>
                      <Button type='submit' variant="contained" className="btn btn-success w-100 rounded-0">Submit</Button>
                  </div>
                  </form> 
                </Modal.Body>
              </Modal>
              <Modal show={isShowEdit} style={{marginTop:"190px"}}>
                <Modal.Header closeButton onClick={() => {initModal("close","edit")}}>
                  <Modal.Title>Edit Jabatan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={handleUpdate}>
                  <div className="mb-3" >
                      <input type="hidden" value={editJabatan.id} name="id"/>
                      <TextField label = "Nama Jabatan"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="name"
                          id="name"
                          className="form-control rounded-0"
                          defaultValue={editJabatan.name}
                          onChange={handleChange('name','edit')}
                      />
                  </div>
                  <div className="mb-3">
                      <TextField label = "Gaji Pokok"
                          type="text"
                          placeholder=""
                          autoComplete="off"
                          name="pokok"
                          id="pokok"
                          className="form-control rounded-0"
                          defaultValue={numberFormat(editJabatan.pokok)}
                          onChange={handleChange('pokok','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Biaya Transportasi"
                          type="text"
                          placeholder=""
                          name="transportasi"
                          id="transportasi"
                          className="form-control rounded-0"
                          defaultValue={numberFormat(editJabatan.transportasi)}
                          onChange={handleChange('transportasi','edit')}
                      />
                  </div>
                  <div className="mb-3" >
                      <TextField label = "Uang Makan"
                          type="text"
                          placeholder=""
                          name="makan"
                          id="makan"
                          className="form-control rounded-0"
                          defaultValue={numberFormat(editJabatan.makan)}
                          onChange={handleChange('makan','edit')}
                      />
                  </div>
                  {
                      editJabatan.error ? 
                          <Stack sx={{ width: '100%',marginBottom:'5px' }} spacing={2}>
                              <Alert severity="error">{editJabatan.error}</Alert>
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

export default Jabatan;