import React from "react";
import "../../../assets/home/testimonialsSection.css";
import DoctorAvtar1 from "../../../assets/images/DoctorAvtar1.png";
import DoctorAvtar2 from "../../../assets/images/DoctorAvtar2.png";
import DoctorAvtar3 from "../../../assets/images/DoctorAvtar3.png";


// Dummy testimonials data (Replace with actual data if needed)
const testimonials = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur elit adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
    name: "Ruhfayed Sakib",
    image: DoctorAvtar1, // Replace with actual image
  },
  {
    id: 2,
    text: "Lorem ipsum dolor sit amet consectetur elit adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
    name: "Naimur Rahman",
    image: DoctorAvtar2, // Replace with actual image
  },
  {
    id: 3,
    text: "Lorem ipsum dolor sit amet consectetur elit adipiscing. Aliquam nec suscipit turpis, vel pretium eros.",
    name: "Ruhfayed Sakib",
    image: DoctorAvtar3, // Replace with actual image
  },
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section"  style={{textAlign:"center"}}>
      <div className="testimonials-header">
        <h2>What Our Patients Say About Our Medical Treatments</h2>
        <div className="divider"></div>
      </div>
      <div className="testimonials-slider" style={{justifyContent:"center"}} >
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card animate-card">
            <p className="testimonial-text">{testimonial.text}</p>
            <div className="testimonial-footer" style={{justifyContent:"center", alignItems:"center"}}>
              <img src={testimonial.image} alt={testimonial.name} className="testimonial-avatar" />
              <h3 className="testimonial-name">{testimonial.name}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="testimonials-indicators">
        <span className="indicator active"></span>
        <span className="indicator"></span>
        <span className="indicator"></span>
      </div>
    </section>
  );
};

export default TestimonialsSection;