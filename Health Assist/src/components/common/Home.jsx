import React from 'react'
import FeatureSection from './homePage/FeatureSection'
import DoctorServices from './homePage/DoctorServices'
import DoctorsSection from './homePage/DoctorsSection'
import TestimonialsSection from './homePage/testimonialsSection'
import Footer from './homePage/Footer'
import CopyRight from './homePage/CopyRight'
import FindClinicMap from './homePage/FindClinicMap'
import TotalDoctorsSection from './homePage/TotalDoctorsSection'
import Navbar from './homePage/Navbar'

export const Home = () => {
  return (
    <>
    <div style={{width:"99vw"}}>
   <Navbar></Navbar>
    <FeatureSection></FeatureSection>
    <DoctorServices></DoctorServices>
    <DoctorsSection></DoctorsSection>
    <TotalDoctorsSection></TotalDoctorsSection>
    <TestimonialsSection></TestimonialsSection>
    <FindClinicMap></FindClinicMap>
    <Footer></Footer>
    <CopyRight></CopyRight>
    </div>
    </>
  )
}


