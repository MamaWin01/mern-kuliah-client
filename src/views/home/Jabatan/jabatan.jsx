import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Grid, Typography } from "@mui/material"
import { numberFormat } from '../../../helpers/number'
import { Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  status: {
    danger: '#e53e3e',
    success: '#18d618'
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
  },
});
  

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
        { return <ThemeProvider theme={theme}><Button color="success" component={Link} to={'home/jabatan/' + params.row.id} variant="contained">Edit</Button></ThemeProvider>}}
  ];

const Table = (props) => {
    return (
      <div style={{ height: 500, width: '100%', marginTop: '30px' }}>
        <DataGrid
          rows={props.data}
          columns={columns}
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
    const token = auth.isAuthenticated().token;
    const [jabatan, setJabatan] = useState(Array)

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
                    console.log(data)
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

    return(
        <div>
            <Grid container spacing="1">
                <Grid item xs={8}>
                <Typography sx={{ textAlign: 'left' }}>
                    Data Jabatan
                </Typography>
                </Grid>
                <Grid item xs={4}>
                <Button component={Link} to="/home/jabatan/create" variant="contained" sx={{ float: 'right' }}>Tambah Data</Button>
                </Grid>
            </Grid>
            <Table data={jabatan}/>
        </div>
    )
}

export default Jabatan;