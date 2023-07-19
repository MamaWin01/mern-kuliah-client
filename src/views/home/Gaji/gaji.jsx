import {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import auth from '../../../helpers/auth'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Grid, Typography } from "@mui/material"
import { numberFormat } from '../../../helpers/number'
import { createTheme} from '@mui/material/styles';

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


export default function Gaji() {
    // for refresh page
    const [isChange, setChange] = useState(false)
    // token
    const token = auth.isAuthenticated().token;
    // for data and navigate
    const [Gaji, setGaji] = useState(Array)

    // for validation and karyawan
    useEffect(() => {
        async function getData() {
            try {
                let data = await fetch(`${import.meta.env.VITE_API_URL}/api/gaji`, {
                  method: 'get',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                  }
                })
                data.json().then(data => {
                    if(data.result){
                        setGaji(data.result)
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
            return (params.row.karyawan.name)
            }},
        { field: 'jabatan', headerName: 'Jabatan', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => { 
            return (params.row.jabatan.name)} }, 
        { field: 'pokok', headerName: 'Gaji pokok', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => { 
            return ('Rp ' + params.row.jabatan.pokok)} }, 
        { field: 'transportasi', headerName: 'Biaya Transportasi', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => { 
            return ('Rp ' + params.row.jabatan.transportasi)} }, 
        { field: 'makan', headerName: 'Biaya Makan', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => { 
            return ('Rp ' + params.row.jabatan.makan)} }, 
        { field: 'kehadiran', headerName: 'Potongan Kehadiran', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => {
            console.log(params.row) 
            return 'Rp ' + numberFormat(parseInt(params.row.jabatan.pokok.replace(',','')) - ((parseInt(params.row.jabatan.pokok.replace(',','')) / 31) * parseInt(params.row.kehadiran.hadir)))} }, 
        { field: 'total', headerName: 'Total Gaji', flex: 1, align:"center", headerAlign:"center", valueGetter:(params) => { 
            return 'Rp ' + numberFormat(parseInt(params.row.jabatan.pokok.replace(',','')) + parseInt(params.row.jabatan.transportasi.replace(',','')) + parseInt(params.row.jabatan.makan.replace(',','')) - (parseInt(params.row.jabatan.pokok.replace(',','')) - ((parseInt(params.row.jabatan.pokok.replace(',','')) / 31) * parseInt(params.row.kehadiran.hadir))))} }, 
        
      
    
    ];

    return(
        <div>
            <Grid container spacing="1">
                <Grid item xs={8}>
                <Typography sx={{ textAlign: 'left' }}>
                    Data Gaji
                </Typography>
                </Grid>
            </Grid>
            <Table data={Gaji} columns={columns}/>
        </div>
    )
}
