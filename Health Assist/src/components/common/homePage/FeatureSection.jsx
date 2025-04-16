import React from "react";
import "../../../assets/home/FeatureSection.css";
import doctorOnline from "../../../assets/images/doctorOnline2.png";
import searchDoctor from "../../../assets/images/searchDoctor.png";
import appointmentBooking from "../../../assets/images/appointmentBooking2.png";

const FeatureSection = () => {
  const features = [
    {
      id: 1,
      image: doctorOnline, // Replace with actual image path
      title: "Instant Video Consultation",
      description: "Connect within 60 secs",
      bgColor: "feature-bg-blue",
    },
    {
      id: 2,
      image: searchDoctor, // Replace with actual image path
      title: "Find Doctors Near You",
      description: "Confirmed appointments",
      bgColor: "feature-bg-teal",
    },
    {
      id: 3,
      image: appointmentBooking, // Replace with actual image path
      title: "Book Your Appointment ",
      description: "Safe and trusted centers",
      bgColor: "feature-bg-purple",
    },
  ];

  return (
    <div className="feature-section" style={{justifyContent:"center"}}>
      {features.map((feature) => (
        <div key={feature.id} className={`feature-card ${feature.bgColor}`}>
          <div className="feature-image">
            <img src={feature.image} alt={feature.title} />
          </div>
          <div className="feature-content">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureSection;
