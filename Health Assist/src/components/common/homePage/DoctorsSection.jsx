import React from "react";
import "../../../assets/home/doctorsSection.css";
import Doctor1 from "../../../assets/images/Doctor1.png";
import Doctor2 from "../../../assets/images/Doctor2.png";
import Doctor3 from "../../../assets/images/Doctor3.png";
import Doctor4 from "../../../assets/images/Doctor4.png";

// Dummy doctors data (Replace with actual data if needed)
const doctors = [
  {
    id: 1,
    image: Doctor1, // Replace with actual image
    name: "Dr. Sophia Miller",
    department: "Cardiology",
  },
  {
    id: 2,
    image: Doctor2, // Replace with actual image
    name: "Dr. John Smith",
    department: "Neurology",
  },
  {
    id: 3,
    image: Doctor3, // Replace with actual image
    name: "Dr. Emily Chen",
    department: "Pediatrics",
  },
  {
    id: 4,
    image: Doctor4, // Replace with actual image
    name: "Dr. Michael Brown",
    department: "Orthopedics",
  },
];

const DoctorsSection = () => {
  return (
    <section className="doctors-section" style={{textAlign:"center" }}>
      <div className="doctors-header" style={{marginTop:"-70px"}}>
        <span className="doctors-badge">Doctors</span>
        <h2>Our Experienced Doctors</h2>
      </div>
      <div className="doctors-grid" style={{justifyContent:"center"}}>
        {doctors.map((doctor) => (
          <div key={doctor.id} className="doctor-card">
            <img src={doctor.image} alt={doctor.name} className="doctor-image" />
            <div className="doctor-info" style={{textAlign:"center"}}>
              <h3 className="doctor-name">{doctor.name}</h3>
              <p className="doctor-department">{doctor.department}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorsSection;
