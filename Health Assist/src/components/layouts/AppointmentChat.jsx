import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Avatar, 
  Paper, 
  IconButton, 
  Divider,
  CircularProgress,
  Badge,
  Tooltip
} from '@mui/material';
import { 
  Send, 
  Videocam, 
  Mic, 
  AttachFile, 
  Close,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AppointmentChat = ({ userRole }) => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socketError, setSocketError] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [otherParticipant, setOtherParticipant] = useState(null);
  const messagesEndRef = useRef(null);
  const userId = localStorage.getItem('id') || 'demo-user-id';

  useEffect(() => {
    console.log('Appointment ID:', appointmentId);
    console.log('User ID:', userId);
    console.log('User Role:', userRole);

    if (!socket) {
      setError('Connection not established');
      setLoading(false);
      return;
    }

    const fetchAppointmentDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch appointment details
        console.log('Fetching appointment details for ID:', appointmentId);
        const response = await axios.get(`/appointment/appointment/${appointmentId}`);
        console.log('Appointment response:', response.data);
        const appointment = response.data.data;
        setAppointmentDetails(appointment);

        // Fetch other participant details
        const otherId = userRole === 'DOCTOR' ? appointment.patient : appointment.doctor;
        const otherModel = userRole === 'DOCTOR' ? 'User' : 'Doctor';
        
        console.log('Fetching other participant:', otherId, 'Model:', otherModel);
        const otherResponse = await axios.get(`/${otherModel.toLowerCase()}/${otherId}`);
        console.log('Other participant response:', otherResponse.data);
        setOtherParticipant(otherResponse.data.data);

        // Join the chat room
        console.log('Joining socket room with:', { appointmentId, userId, userRole });
        socket.emit('join_appointment_room', { 
          appointmentId, 
          userId,
          userRole 
        });

      } catch (err) {
        console.error('Error fetching appointment details:', {
          error: err,
          response: err.response,
          config: err.config
        });
        const errorMsg = err.response?.data?.message || 
                        err.message || 
                        'Failed to load chat. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
        navigate(userRole === 'DOCTOR' ? '/doctor/appointments' : '/user/appointments');
      } finally {
        setLoading(false);
      }
    };

    const handleSocketError = (error) => {
      console.error('Socket error:', error);
      setSocketError('Connection error. Please refresh the page.');
      toast.error('Connection error. Please refresh the page.');
    };

    // Set up socket listeners
    socket.on('chat_ready', ({ previousMessages }) => {
      console.log('Chat ready with messages:', previousMessages);
      setMessages(previousMessages || []);
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages(prev => [...prev, message]);
    });

    socket.on('chat_error', ({ message }) => {
      console.error('Chat error:', message);
      setError(message);
      toast.error(message);
    });

    socket.on('connect_error', handleSocketError);
    socket.on('error', handleSocketError);

    fetchAppointmentDetails();

    return () => {
      socket.off('chat_ready');
      socket.off('receive_message');
      socket.off('chat_error');
      socket.off('connect_error');
      socket.off('error');
    };
  }, [socket, appointmentId, userId, userRole, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    if (!socket || !socket.connected) {
      toast.error('Connection lost. Please refresh the page.');
      return;
    }

    const messageData = {
      senderId: userId,
      senderRole: userRole,
      message: newMessage,
      appointmentId
    };

    console.log('Sending message:', messageData);
    socket.emit('send_appointment_message', messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndAppointment = async () => {
    try {
      setLoading(true);
      console.log('Completing appointment:', appointmentId);
      await axios.patch(`/appointment/complete/${appointmentId}`);
      toast.success('Appointment completed successfully');
      navigate(userRole === 'DOCTOR' ? '/doctor/appointments' : '/user/appointments');
    } catch (err) {
      console.error('Error completing appointment:', {
        error: err,
        response: err.response,
        config: err.config
      });
      toast.error(err.response?.data?.message || 'Failed to complete appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>Loading chat...</Typography>
      </Box>
    );
  }

  if (error || socketError) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="80vh">
        <Error color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h6" color="error" gutterBottom>
          {error || socketError}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={otherParticipant?.profilePic || otherParticipant?.userPic} 
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">
              {userRole === 'DOCTOR' ? 
                `${otherParticipant?.Firstname} ${otherParticipant?.Lastname}` : 
                `Dr. ${otherParticipant?.Firstname} ${otherParticipant?.Lastname}`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointmentDetails?.status === 'Started' ? 
                'Online - In Consultation' : 'Offline'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <Tooltip title="Start Video Call">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <Videocam />
            </IconButton>
          </Tooltip>
          <Tooltip title="Start Voice Call">
            <IconButton color="primary" sx={{ mr: 1 }}>
              <Mic />
            </IconButton>
          </Tooltip>
          {userRole === 'DOCTOR' && (
            <Tooltip title="Complete Appointment">
              <Button 
                variant="contained" 
                color="success" 
                size="small"
                startIcon={<CheckCircle />}
                onClick={handleEndAppointment}
                sx={{ mr: 1 }}
              >
                Complete
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Close Chat">
            <IconButton onClick={() => navigate(userRole === 'DOCTOR' ? '/doctor/appointments' : '/user/appointments')}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Messages area */}
      <Box sx={{ 
        flex: 1, 
        overflowY: 'auto', 
        p: 2, 
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {messages.length === 0 ? (
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <Typography variant="body1" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.sender === userId ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              {message.sender !== userId && (
                <Avatar 
                  src={message.senderRef?.profilePic || message.senderRef?.userPic} 
                  sx={{ mr: 1, alignSelf: 'flex-end' }}
                />
              )}
              <Box
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.sender === userId ? 'primary.main' : 'background.paper',
                  color: message.sender === userId ? 'primary.contrastText' : 'text.primary',
                  p: 1.5,
                  borderRadius: 2,
                  boxShadow: 1,
                  position: 'relative',
                  ...(message.sender === userId ? {
                    borderTopRightRadius: 0,
                    mr: 1
                  } : {
                    borderTopLeftRadius: 0,
                    ml: 1
                  })
                }}
              >
                <Typography variant="body1">{message.message}</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'right',
                    color: message.sender === userId ? 'primary.contrastText' : 'text.secondary',
                    mt: 0.5
                  }}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message input area */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton>
            <AttachFile />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            variant="outlined"
            sx={{ mr: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={!newMessage.trim()}
            onClick={handleSendMessage}
            endIcon={<Send />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppointmentChat;