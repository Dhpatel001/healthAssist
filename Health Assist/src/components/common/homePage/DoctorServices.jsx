import React, { useState } from "react";
import "../../../assets/home/doctorServices.css";

const services = [
  {
    id: 1,
    icon: "💙",
    title: "Cardiology",
    description: "Heart health, circulation, vessels, diagnosis, treatment of cardiac diseases.",
  },
  {
    id: 2,
    icon: "🏥",
    title: "Pulmonary",
    description: "Lungs, respiration, airways, breathing, diagnosis of respiratory conditions.",
  },
  {
    id: 3,
    icon: "🧠",
    title: "Neurology",
    description: "Brain, nerves, spinal cord, disorders, diagnosis, and treatment of neurological issues.",
  },
  {
    id: 4,
    icon: "♿",
    title: "Orthopedics",
    description: "Bones, joints, muscles, ligaments, fractures, surgical and non-surgical repair.",
  },
  {
    id: 5,
    icon: "🦷",
    title: "Dental Surgery",
    description: "Oral cavity, teeth, gums, extractions, implants, surgical procedures.",
  },
  {
    id: 6,
    icon: "🧪",
    title: "Laboratory",
    description: " Analysis, tests, samples, diagnostics, pathology, medical investigations.",
  },
];

const DoctorServices = () => {
  const [hoveredService, setHoveredService] = useState(null);

  return (
    <section className="doctor-services" style={{textAlign:"center"}}>
      <div className="services-header" style={{marginTop:"-80px"}}>
        <span className="services-badge">Services</span>
        <h2>Health Care Solutions</h2>
      </div>
      <div className="services-grid" style={{justifyContent:"center"}}>
        {services.map((service) => (
          <div key={service.id} className="service-card" style={{textAlign:"center"}}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div
              className="service-button-container"
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <button className="service-button">+</button>
              {hoveredService === service.id && <span className="read-more">Read More</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DoctorServices;
