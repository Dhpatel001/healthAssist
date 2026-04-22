# Health Assist 🩺

Health Assist is a comprehensive, full-stack healthcare platform built with the **MERN** (MongoDB, Express, React, Node.js) stack. It connects patients with doctors, offering a wide array of telemedicine and healthcare management features to streamline medical consultations and health tracking.

## 🚀 Features

- **User Roles & Authentication:** Secure authentication with distinct roles for Users (Patients), Doctors, and Administrators using JWT.
- **Appointment Booking:** Patients can easily search for doctors and schedule appointments.
- **Real-time Chat & Telemedicine:** Built-in Socket.io integration allows real-time messaging between doctors and patients, complete with typing indicators, read receipts, and file sharing.
- **Electronic Health Records (EHR):** Secure storage and management of patient health records.
- **Health Insights & Alerts:** Personalized health tracking and notifications.
- **Prescription Management:** Doctors can issue and manage digital prescriptions for their patients.
- **Payment Integration:** Secure payment processing for consultations using Razorpay.
- **Reviews & Ratings:** Patients can leave feedback and rate their experiences with doctors.

## 🛠️ Tech Stack

### Frontend (`Health Assist`)
- **Framework:** React 18 with Vite
- **Styling:** Material UI (MUI), Styled Components, Emotion
- **Charts & Visualizations:** Recharts, Chart.js
- **Real-time:** Socket.io-client
- **State Management & Routing:** React Router DOM, React Hook Form
- **Other Utilities:** Axios, Moment.js, Framer Motion, React Big Calendar

### Backend (`25-intern-node`)
- **Server:** Node.js with Express.js
- **Database:** MongoDB with Mongoose
- **Real-time:** Socket.io
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt
- **File Uploads:** Multer & Cloudinary
- **Payments:** Razorpay
- **Emails:** Nodemailer

## 📁 Project Structure

- `/Health Assist`: Contains the React frontend application.
- `/25-intern-node`: Contains the Node.js/Express backend server.

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally on `mongodb://127.0.0.1:27017/` or via MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd MERN
```

### 2. Backend Setup
```bash
cd 25-intern-node
npm install
```
- Create a `.env` file in the `25-intern-node` directory and add the required environment variables (Database URI, JWT Secret, Cloudinary keys, Razorpay keys, etc.).
- Start the development server:
```bash
node app.js
```
*(The backend server will start on port 3000)*

### 3. Frontend Setup
```bash
cd ../Health Assist
npm install
```
- Start the Vite development server:
```bash
npm run dev
```

## 📜 License

This project is licensed under the ISC License.
