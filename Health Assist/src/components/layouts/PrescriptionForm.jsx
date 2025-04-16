import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  MedicalServices,
  Add,
  Remove,
  Close,
  Save,
  Cancel as CancelIcon,
  CalendarToday,
  Person
} from '@mui/icons-material';

const PrescriptionForm = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();


  
  // Destructure data from navigation state
  const { 
    appointmentId,
    doctorId,
    patientId,
    patientName,
    appointmentDate
  } = location?.state || {};

  // Log all received IDs immediately
  useEffect(() => {
    console.log("✅ Received IDs from navigation:", {
      appointmentId,
      doctorId,
      patientId,
      patientName,
      appointmentDate
    });

    if (!appointmentId || !doctorId || !patientId) {
      toast.error('❌ Missing required appointment data!');
      console.error("Missing IDs:", { appointmentId, doctorId, patientId });
      navigate(-1); // Go back if data is missing
    }
  }, [appointmentId, doctorId, patientId, navigate]);

  const [formData, setFormData] = useState({
    diagnosis: '',
    medications: [{ 
      medicineName: '', 
      dosage: '', 
      frequency: '', 
      duration: '',
      instructions: '' 
    }],
    notes: '',
    followUpDate: ''
  });


  
  // Handle medication input changes
  const handleMedicationChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMedications = [...formData.medications];
    updatedMedications[index][name] = value;
    setFormData({ ...formData, medications: updatedMedications });
  };

  // Add a new medication field
  const addMedicationField = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { 
        medicineName: '', 
        dosage: '', 
        frequency: '', 
        duration: '',
        instructions: '' 
      }]
    });
  };

  // Remove a medication field
  const removeMedicationField = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({ ...formData, medications: updatedMedications });
  };

  // Handle general form changes (diagnosis, notes, follow-up date)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit prescription to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    if (!formData.diagnosis) {
      toast.error('❌ Diagnosis is required!');
      return;
    }

    // Validate each medication
    for (const med of formData.medications) {
      if (!med.medicineName || !med.dosage || !med.frequency || !med.duration) {
        toast.error('❌ All medication fields except instructions are required!');
        return;
      }
    }

    try {
      const response = await axios.post('http://localhost:3000/prescription/create', {
        appointmentId,
        doctorId,
        patientId,
        diagnosis: formData.diagnosis,
        medications: formData.medications,
        notes: formData.notes,
        followUpDate: formData.followUpDate
      });
      
      toast.success('✅ Prescription created successfully!');
      console.log("📄 Prescription saved:", response.data);
      
      onClose?.(); // Close the form
      
    } catch (error) {
      console.error('Full error:', error);
      toast.error(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
            Create Prescription
          </Typography>
          <IconButton onClick={() => navigate('/doctor/home')}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Patient Name"
                  value={patientName || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Appointment Date"
                  value={appointmentDate ? new Date(appointmentDate).toLocaleDateString() : ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a8a' }}>
              Diagnosis
            </Typography>
            <TextField
              fullWidth
              label="Diagnosis *"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
                Medications *
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<Add />}
                onClick={addMedicationField}
              >
                Add Medication
              </Button>
            </Box>

            {formData.medications.map((med, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Medicine Name *"
                      name="medicineName"
                      value={med.medicineName}
                      onChange={(e) => handleMedicationChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Dosage *"
                      name="dosage"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Frequency *"
                      name="frequency"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Duration *"
                      name="duration"
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, e)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label="Instructions"
                      name="instructions"
                      value={med.instructions}
                      onChange={(e) => handleMedicationChange(index, e)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={1}>
                    {formData.medications.length > 1 && (
                      <IconButton
                        color="error"
                        onClick={() => removeMedicationField(index)}
                        sx={{ mt: 1 }}
                      >
                        <Remove />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1e3a8a' }}>
              Additional Information
            </Typography>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Follow-up Date"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<CancelIcon />}
          onClick={onClose}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={handleSubmit}
        >
          Save Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionForm;