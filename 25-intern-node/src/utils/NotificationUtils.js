const mailUtil = require('./MailUtils');

const sendAppointmentConfirmation = async (appointment, user) => {
  const subject = `Appointment Confirmation #${appointment._id}`;
  const html = `
    <h2>Your appointment has been booked</h2>
    <p>Doctor: Dr. ${appointment.doctorId.Firstname} ${appointment.doctorId.Lastname}</p>
    <p>Date: ${appointment.appointmentDate.toDateString()}</p>
    <p>Time: ${appointment.appointmentTime}</p>
    <p>Status: ${appointment.status}</p>
  `;
  
  await mailUtil.sendingMail(user.email, subject, html);
};

const sendCancellationNotification = async (appointment, user) => {
  const subject = `Appointment Cancelled #${appointment._id}`;
  const html = `
    <h2>Your appointment has been cancelled</h2>
    <p>Doctor: Dr. ${appointment.doctorId.Firstname} ${appointment.doctorId.Lastname}</p>
    <p>Original Date: ${appointment.appointmentDate.toDateString()}</p>
    <p>Reason: ${appointment.cancellationReason}</p>
  `;
  
  await mailUtil.sendingMail(user.email, subject, html);
};

module.exports = {
  sendAppointmentConfirmation,
  sendCancellationNotification
};