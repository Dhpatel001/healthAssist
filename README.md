# Health Assist 🩺 | Smart Healthcare Solutions

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933.svg)](https://nodejs.org/)

Health Assist is a high-performance, full-stack healthcare ecosystem designed to bridge the gap between patients and medical professionals. Leveraging the power of the **MERN** stack and **Socket.io**, it provides a seamless, real-time experience for telemedicine, appointment management, and personal health tracking.

---

## 🌟 Key Features

### 🏥 For Patients (Users)
- **Smart Appointment Booking:** Browse doctors by specialty, location, and availability.
- **Telemedicine & Real-time Chat:** Direct communication with doctors via a secure chat interface with file sharing (reports, prescriptions).
- **Personal Health Vault (EHR):** Securely store and access your medical history and digital health records.
- **Health Insights & Alerts:** AI-driven personalized health tracking and timely medication/check-up alerts.
- **Seamless Payments:** Integrated Razorpay for secure and instant consultation fee payments.

### 👨‍⚕️ For Doctors
- **Patient Management Dashboard:** Effortlessly manage appointments and view patient history.
- **Digital Prescriptions:** Generate and share digital prescriptions directly through the platform.
- **Real-time Consultation:** Engage in telemedicine sessions with typing indicators and read receipts.
- **Review System:** Build your professional reputation through patient feedback and ratings.

### 🔑 For Administrators
- **Robust Access Control:** Full control over users, doctors, and system-wide configurations.
- **Analytics & Reporting:** Monitor platform growth, appointments, and financial transactions.

---

## 🛠️ Technology Architecture

### Frontend (Modern UI/UX)
- **Core:** [React 18](https://reactjs.org/) with [Vite](https://vitejs.dev/) for lightning-fast performance.
- **UI Framework:** [Material UI (MUI)](https://mui.com/) & [Styled Components](https://styled-components.com/).
- **Data Visualization:** [Recharts](https://recharts.org/) & [Chart.js](https://www.chartjs.org/) for health metrics.
- **State & Routing:** `react-router-dom` v7, `react-hook-form`.
- **Real-time:** `socket.io-client`.

### Backend (Scalable Infrastructure)
- **Runtime:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/).
- **Database:** [MongoDB](https://www.mongodb.com/) using [Mongoose ODM](https://mongoosejs.com/).
- **Real-time Engine:** [Socket.io](https://socket.io/) for bidirectional communication.
- **Authentication:** JWT (JSON Web Tokens) with `bcrypt` password hashing.
- **Media Management:** [Cloudinary](https://cloudinary.com/) for secure medical document and image storage.
- **Integrations:** [Razorpay](https://razorpay.com/) (Payments), [Nodemailer](https://nodemailer.com/) (Email Alerts).

---

## 📁 Project Structure

```bash
├── 25-intern-node/       # Backend (Node.js/Express Server)
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API endpoints
│   │   └── utils/        # Helper functions
│   └── app.js            # Server entry point & Socket logic
├── Health Assist/        # Frontend (React Application)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── assets/       # Static assets
│   │   └── App.jsx       # Main application component
└── assets/               # Project documentation assets
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or Atlas cluster)

### 2. Repository Setup
```bash
git clone <repository-url>
cd MERN
```

### 3. Backend Configuration
```bash
cd 25-intern-node
npm install
```
Create a `.env` file in `25-intern-node/`:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_id
RAZORPAY_KEY_SECRET=your_secret
```
Run the server:
```bash
node app.js
```

### 4. Frontend Configuration
```bash
cd ../Health Assist
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 📜 License & Acknowledgments

This project is licensed under the **ISC License**. Developed with passion for better healthcare accessibility.

---

<p align="center">
  Made with ❤️ by the Health Assist Team
</p>
