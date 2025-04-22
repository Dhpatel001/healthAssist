import { useEffect, useState } from 'react'
import { UserSidebar } from './components/layouts/UserSidebar'
// import './App.css'
import "./assets/adminlte.css"
import "./assets/adminlte.min.css"
import { Route, Routes, useLocation } from 'react-router-dom'
import { Login } from './components/common/Login'
import { UserProfile } from './components/user/UserProfile'
import { Signup } from './components/common/Signup'
import { AdminSidebar } from './components/layouts/AdminSidebar'
import axios from 'axios'
import { DoctorSidebar } from './components/layouts/DoctorSidebar'
import { DoctorLogin } from './components/common/DoctorLogin'
import { DoctorSignup } from './components/common/DoctorSignup'
import { DoctorProfile } from './components/doctor/DoctorProfile'
import { AdminLogin } from './components/common/AdminLogin'
// import { Doctor } from './components/doctor/Doctor'
import PrivateRoutes from './hooks/PrivateRoutes'
import LandingPage from './components/common/LandingPage'
import AboutUs from './components/common/AboutUs'
import ContactUs from './components/common/ContactUs'
// import DoctorInfo from "./components/doctor/DoctorInfo";
import { DoctorUpdatedProfile } from './components/doctor/DoctorUpdatedProfile'
import { DoctorList } from './components/admin/DoctorList'
import { UserList } from './components/admin/UserList'
import { DoctorDetail } from './components/doctor/DoctorDetail'
import { HomePage } from './components/common/HomePage'
import { AppointmentForm } from './components/user/AppointmentForm'
import { UserUpdatedProfile } from './components/user/UserUpdatedProfile'
import { AppointmentDetails } from './components/doctor/AppointmentDetails'
import { PendingAppointments } from './components/doctor/PendingAppointments'
import { ResetPassword } from './components/common/ResetPassword'
import { ForgetPassword } from './components/common/ForgetPassword'
import { Home } from './components/common/Home'
import Error404 from './components/common/Error404'
import AllDoctorList from './components/common/homePage/AllDoctorList'
import AppointmentByDoctor from './components/common/homePage/AppointmentByDoctor'
import { UserHomePage } from './components/layouts/UserHomePage'
import { DoctorHomePage } from './components/layouts/DoctorHomePage'
import { Services } from './components/common/homePage/Services'
import { DoctorAppointment } from './components/doctor/DoctorAppointment'
import UserPrivateRoute from './hooks/UserPrivateRoutes'
import VideoConsultation from './components/common/VideoConsultation'
import DoctorChatPage from './components/layouts/DoctorChatPage'
import UserChatPage from './components/layouts/UserChatPage'
import { AdminHomePage } from './components/layouts/AdminHomePage'
import PrescriptionForm from './components/layouts/PrescriptionForm'
import PatientPrescriptions from './components/layouts/PatientPrescriptions'
import PrescriptionDetails from './components/layouts/PrescriptionDetails'
import EHRDashboard from './components/user/EHRDashboard'
import { Razorpay } from './components/layouts/Razorpay'
import PendingApproval from './components/doctor/PendingApproval'
import { DoctorForgetPassword } from './components/common/DoctorForgetPassword'
import { DoctorResetPassword } from './components/common/DoctorResetPassword'

function App() {
  axios.defaults.baseURL = "http://localhost:3000"

   const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/signup") {
      document.body.className = ""; // Remove the unwanted class for login and signup
    } else {
      document.body.className =
        "layout-fixed sidebar-expand-lg bg-body-tertiary sidebar-open app-loaded";
    }
  }, [location.pathname]);

  return (

    // <body className='layout-fixed sidebar-expand-lg bg-body-tertiary app-loaded sidebar-open'>

    <div className={location.pathname === "/login" || location.pathname === "/signup" ? "" : "app-wrapper"}>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/razorpay' element={<Razorpay/>}></Route>
          <Route path='/doctorlogin' element={<DoctorLogin/>}></Route>
          <Route path='/doctorsignup' element={<DoctorSignup/>}></Route>
          <Route path='/adminlogin' element={<AdminLogin/>}></Route>
          <Route path="/aboutus" element ={<AboutUs/>}></Route>
          <Route path="/prescriptions" element ={<PatientPrescriptions/>}></Route>
          <Route path="/prescription/:id" element ={<PrescriptionDetails/>}></Route>
          <Route path="/contactus" element ={<ContactUs/>}></Route>
          {/* <Route path="/" element ={<LandingPage/>}></Route> */}
          {/* <Route path="/home" element ={<HomePage/>}></Route> */}
          <Route path="/home" element ={<Home/>}></Route>
          <Route path="/forgotpassword" element ={<ForgetPassword/>}></Route>
          <Route path="/doctorforgotpassword" element ={<DoctorForgetPassword/>}></Route>
          <Route path="/resetpassword/:token" element ={<ResetPassword/>}></Route>
          <Route path="/doctorresetpassword/:token" element ={<DoctorResetPassword/>}></Route>
          {/* <Route path="/" element ={<HomePage/>}></Route> */}
          <Route path="/alldoctor" element ={<AllDoctorList/>}></Route>
          <Route path="/appointmentbydoctor/:doctorId" element ={<AppointmentByDoctor/>}></Route>
          <Route path="/services" element ={<Services/>}></Route>
          <Route path="/doctor/pending-approval" element ={<PendingApproval/>}></Route>
          <Route path="/" element ={<Home/>}></Route>
          <Route path="/*" element ={<Error404/>}></Route>

          
          <Route path="" element={<PrivateRoutes/>}>

          <Route element={<UserPrivateRoute allowedRole="USER"/>}>
          <Route path='/user' element={<UserSidebar/>}>
            <Route path='profile' element={<UserProfile/>}></Route>
            <Route path='home' element={<UserHomePage/>}></Route>
            <Route path='ehr' element={<EHRDashboard/>}></Route>
          <Route path="chat/:appointmentId" element={<UserChatPage/>} />
            <Route path='video' element={<VideoConsultation/>}></Route>
            <Route path='userform' element={<UserUpdatedProfile/>}></Route>
            <Route path='appointment' element={<AppointmentForm/>}></Route>
            {/* <Route path='doctorprofile' element={<DoctorProfile/>}></Route> */}   
          </Route>
          </Route>

          {/* <Route element={<UserPrivateRoute allowedRole="ADMIN" />}>
          <Route path='/admin' element={<AdminSidebar/>}>
            <Route path='profile' element={<UserProfile/>}></Route>
          </Route>
          </Route> */}



          <Route element={<UserPrivateRoute allowedRole="DOCTOR"/>}>
          <Route path='/doctor' element={<DoctorSidebar/>}>
              <Route path='doctordetail' element={<DoctorDetail/>}></Route>
              <Route path='home' element={<DoctorHomePage/>}></Route>
              <Route path='prescription' element={<PrescriptionForm/>}></Route>
              {/* <Route path='appointmentspage' element={<DoctorChatPage/>}></Route> */}
              <Route path="chat/:appointmentId" element={<DoctorChatPage/>} />
              <Route path='appointments' element={<DoctorAppointment/>}></Route>
              <Route path='totalappointment' element={<AppointmentDetails/>}></Route>
              <Route path='pendingappointment' element={<PendingAppointments/>}></Route>
              <Route path='updateprofile/:id' element={<DoctorUpdatedProfile/>}></Route>
          </Route>
          </Route>

          
          <Route element={<UserPrivateRoute allowedRole="ADMIN"/>}>
          <Route path='/admin' element={<AdminSidebar/>}>
          <Route path='doctorlist' element={<DoctorList/>}></Route>
          <Route path='home' element={<AdminHomePage/>}></Route>
          <Route path='userlist' element={<UserList/>}></Route>
          </Route>
          </Route>
          </Route>
          {/* <Route path="/*" element = {<Error404/>}></Route> */}

        </Routes>
      </div>
      
    // </body>
  )
}

export default App
