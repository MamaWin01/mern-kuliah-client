import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Grid, Typography } from "@mui/material"
import { numberFormat } from '../../../helpers/number'
import { useNavigate, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Modal } from 'react-bootstrap'
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
        />
      </div>
    );
  }

function Jabatan() {
    // for modal poup yey!
    const [isShowCreate, invokeModalCreate] = useState(false)
    const [isShowEdit, invokeModalEdit] = useState(false)
    const [editJabatan, setEditJabatan] = useState({
      name: '',
      pokok: '',
      transportasi: '',
      makan: '',
    })

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
          return invokeModalCreate(false)
        } else {
          return invokeModalEdit(false)
        }
      }
    }
    // token
    const token = auth.isAuthenticated().token;
    // for data and navigate
    const Navigate = useNavigate()
    const [jabatan, setJabatan] = useState(Array)
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
                    }
                })
              } catch (err) {
                console.log(err)
              }
        }
        getData()
    }, [token])

    // column for grid table
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'name', headerName: 'Nama Jabatan', flex: 1 },
      { field: 'pokok', headerName: 'Gaji Pokok', flex: 1 , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'transportasi', headerName: 'Biaya Transportasi', flex: 1 , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'makan', headerName: 'Uang Makan', flex: 1 , valueFormatter:(params) => 
          { return 'Rp ' + numberFormat(params.value)}},
      { field: 'total', headerName: 'Total', flex: 1, valueGetter:(params) =>
          { return 'Rp ' + numberFormat(parseInt(params.row.pokok) + parseInt(params.row.transportasi) + parseInt(params.row.makan))} },
      { field: 'action', headerName: 'Action', flex: 1, renderCell:(params) => 
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
        }
      } catch (err) {
        console.log(err)
      }
    }

    // create jabatan
    async function handleCreate() {
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
        if(response.error) {
          alert('something went wrong')
        } else {
        }
      } catch (err) {
        console.log(err)
      }
    }

    // update jabatan
    // create jabatan
    async function handleUpdate() {
      console.log(editJabatan);
    }

    const [values, setValues] = useState({
      name: '',
      pokok: '',
      transportasi: '',
      makan: '',
      error: '',
      signedIn: false,
    })

  const handleChange = (name,type) => event => {
    console.log(name)
    console.log(type)
    if(name == 'pokok' || name == 'transportasi' || name == 'makan') {
      event.target.value = numberFormat(event.target.value)
      if(event.target.value == '0') {
        event.target.value = "";
      }
      setValues({...values, [name]: event.target.value })
    } else {
      setValues({...values, [name]: event.target.value })
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
            <Table data={jabatan} columns={columns}/>
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
                          onChange={handleChange('makan','create')}
                      />
                  </div>
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
                  <div style={{paddingBottom:'15px',width:'20%',margin:'auto'}}>
                      <Button type='submit' variant="contained" className="btn btn-success w-100 rounded-0">Update</Button>
                  </div>
                  </form> 
                </Modal.Body>
              </Modal>
            </div>
        </div>
    )
}

export default Jabatan;