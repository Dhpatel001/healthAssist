import React from "react";
import "../../assets/landingPage.css";
import aboutImage from "../../assets/landing/images/about-img2.png";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="about_section">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="img-box">
              <img src={aboutImage} alt="About Us" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="detail-box">
              <div className="heading_container">
                <h2>About Us</h2>
              </div>
              <p>
                Health Assist is a digital healthcare solution designed to
                improve access to medical services. Our platform connects
                patients with healthcare providers, enabling virtual
                consultations, easy appointment booking, and secure electronic
                health records. We streamline medical workflows, enhance
                patient engagement, and promote preventive healthcare
                practices.
              </p>
              <p>
                Our goal is to provide a user-friendly platform where patients
                can find specialized doctors, receive health insights, and
                manage their medical records conveniently. Healthcare providers
                can efficiently manage their services and offer seamless
                telemedicine consultations.
              </p>
              <p>
                With future advancements such as AI-powered symptom checkers,
                wearable device integration, and multilingual support, Health
                Assist is committed to revolutionizing healthcare delivery for
                everyone.
              </p>
              <Link to="/contactus" className="btn-primary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
