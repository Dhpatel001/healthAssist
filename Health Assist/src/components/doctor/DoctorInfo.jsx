import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DoctorInfo = () => { 
  const [doctor, setDoctor] = useState(null);  // Change to store a single object
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!userId) {
      console.error("No User ID found in localStorage");
      return;
    }

    axios.get(`/doctorbyid/${userId}`)
      .then(res => {
        console.log("API Response:", res.data);
        setDoctor(res.data.data);  // Store object directly
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setDoctor(null);  // Prevent errors in JSX 
      });
  }, [userId]);

  return (
    <div className="container">
      <h2>Doctor Info</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Image</th> 
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctor ? (
            <tr key={doctor._id}>
              <td>{doctor.Firstname} {doctor.Lastname}</td>
              <td>{doctor.specialization || "N/A"}</td>
              <td>
                <img src={doctor.profilePic || "/default-doctor.jpg"} alt="Doctor" width="50" />
              </td>
              <td>
                <Link to={`/doctor/updateprofile/${doctor._id}`} className="btn btn-info">
                  Update
                </Link>
              </td>
            </tr>
          ) : (
            <tr>
              <td colSpan="4">No doctor found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorInfo;
