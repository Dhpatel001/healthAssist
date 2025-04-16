
import React from "react";
import { motion } from "framer-motion";
import "../../../assets/home/TotalDoctorsSection.css";

const TotalDoctorsSection = () => {
  const stats = [
    { id: 1, icon: "🏥", value: 250, label: "Hospitals Available" },
    { id: 2, icon: "👨‍⚕️", value: 1200, label: "Specialist Doctors" },
    { id: 3, icon: "😊", value: 45000, label: "Happy Patients" },
    { id: 4, icon: "📅", value: 10, label: "Years of Excellence" },
  ];

  return (
    <div className="total-doctors-section" style={{textAlign:"center" ,justifyContent:"center",alignItems:"center"}} >
      <div className="overlay" style={{alignItems:"center"}}>
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            className="stat-card" 
            style={{textAlign:"center"}}
            whileHover={{ scale: 1.1 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.id * 0.2 }}
          >
            <div className="icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TotalDoctorsSection;
