import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const DoctorList = () => {


    const colums=[
        {field:"_id",headerName:"ID",width:90},
        {field:"Firstname",headerName:"First Name",width:150},
        {field:"qualification",headerName:"Qualification",width:150},
        {field:"specialization",headerName:"Specialization",width:150},
        {field:"availability",headerName:"Availability",width:150},
    ]
    const [doctors, setdoctors] = useState([])

    const getAllDoctors = async()=>{
        const res = await axios.get("/doctor")
        setdoctors(res.data.data)
    }
    useEffect(()=>{
        getAllDoctors()
    },[])
  return (
    <div>
        <h1>DoctorList</h1>
        <DataGrid 
            rows={doctors}
            columns={colums}
            rowsPerPageOptions={[5]}
            checkboxSelection 
            getRowId={(row)=>row._id}  
        ></DataGrid>
    </div>
  )
}

