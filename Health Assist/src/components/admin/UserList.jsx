import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const UserList = () => {

    const columns=[
        {field:"_id",headerName:"ID",width:90},
        {field:"email",headerName:"email",width:90},
        {field:"Firstname",headerName:"FirstName",width:90},
        {field:"Age",headerName:"Age",width:90},
        {field:"Status",headerName:"Status",width:90},
        {field:"mediacalHistory",headerName:"mediacalHistory",width:90},
    ]
    const [users, setusers] = useState([])
    
    const getAllUsers = async()=>{
        const res = await axios.get("/alluser")  
        setusers(res.data.data)
 
    }
    useEffect(()=>{
            getAllUsers()
        },[])
  return (
    <div>
        <h1>UserList</h1>
                <DataGrid 
                    rows={users}
                    columns={columns}
                    rowsPerPageOptions={[5]}
                    checkboxSelection 
                    getRowId={(row)=>row._id}  
                ></DataGrid>
    </div>
  )
}
