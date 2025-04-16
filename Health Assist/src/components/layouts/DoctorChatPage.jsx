import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  Button,
  InputAdornment,
  Avatar
} from '@mui/material';
import { Send, AttachFile, InsertEmoticon, MedicalServices } from '@mui/icons-material';
import { MessageItem, TypingIndicator } from '../context/ChatComponents';
import { toast } from 'react-toastify';

const socket = io('http://localhost:3000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

export const DoctorChatPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [fileInput, setFileInput] = useState(null);
  const messagesEndRef = useRef(null);
  const doctorId = localStorage.getItem('id');

  const validateMessage = (message) => {
    return {
      ...message,
      _id: message._id || Date.now().toString(),
      createdAt: message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString(),
      readBy: message.readBy || [],
      sender: message.sender || { _id: 'unknown', profilePic: '' }
    };
  };

  const fetchAppointmentData = useCallback(async () => {
    try {
      const response = await axios.get(`/appointment/appointment/${appointmentId}`);
      setAppointmentData(response.data.data);
      setLoading(false);
      
      socket.emit('join_appointment_room', {
        appointmentId,
        userId: doctorId,
        userType: 'DOCTOR'
      });
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      toast.error('Failed to load chat data');
      setLoading(false);
    }
  }, [appointmentId, doctorId]);

  useEffect(() => {
    fetchAppointmentData();

    socket.on('chat_ready', ({ previousMessages }) => {
      const validatedMessages = (previousMessages || []).map(validateMessage);
      setMessages(validatedMessages);
    });

    socket.on('receive_message', (message) => {
      const validatedMessage = validateMessage(message);
      setMessages((prev) => [...prev, validatedMessage]);
      
      if (message.sender._id !== doctorId) {
        socket.emit('mark_as_read', {
          messageId: validatedMessage._id,
          userId: doctorId,
          userType: 'DOCTOR'
        });
      }
    });

    socket.on('typing', ({ userId, isTyping: typing }) => {
      if (userId !== doctorId) {
        setIsTyping(typing);
      }
    });

    socket.on('message_read', ({ messageId }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { 
              ...msg, 
              readBy: [...(msg.readBy || []), 
              { userId: doctorId, readAt: new Date().toISOString() } ]
            }
          : msg
      ));
    });

    socket.on('chat_error', (error) => {
      toast.error(error.message || 'Chat error occurred');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      toast.error('Connection error. Please refresh the page.');
    });

    return () => {
      socket.off('chat_ready');
      socket.off('receive_message');
      socket.off('typing');
      socket.off('message_read');
      socket.off('chat_error');
      socket.off('connect_error');
    };
  }, [fetchAppointmentData, doctorId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTyping = () => {
    if (typingTimeout) clearTimeout(typingTimeout);
    
    socket.emit('typing', {
      appointmentId,
      userId: doctorId,
      userType: 'DOCTOR',
      isTyping: true
    });

    setTypingTimeout(setTimeout(() => {
      socket.emit('typing', {
        appointmentId,
        userId: doctorId,
        userType: 'DOCTOR',
        isTyping: false
      });
    }, 2000));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !fileInput) return;
  
    try {
      let attachments = [];
      
      if (fileInput) {
        const formData = new FormData();
        formData.append('file', fileInput);
        
        const uploadResponse = await axios.post('/chat/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        attachments = [{
          url: uploadResponse.data.url,
          type: uploadResponse.data.type,
          name: uploadResponse.data.name,
          size: uploadResponse.data.size
        }];
      }
  
      const messageData = {
        appointmentId,
        senderId: doctorId, // or doctorId
        userType: 'DOCTOR', // or 'DOCTOR'
        message: newMessage,
        attachments,
        createdAt: new Date().toISOString()
      };
      
      if (fileInput) {
        socket.emit('send_file_message', messageData);
      } else {
        socket.emit('send_appointment_message', messageData);
      }
      
      setNewMessage('');
      setFileInput(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleCreatePrescription = () => {
    if (!appointmentData) {
      toast.error('Appointment data not loaded');
      return;
    }
  
    navigate('/doctor/prescription', { 
      state: { 
        appointmentId: appointmentData._id,
        doctorId: appointmentData.doctorId._id || appointmentData.doctorId,
        patientId: appointmentData.userId._id || appointmentData.userId,
        patientName: `${appointmentData.firstName} ${appointmentData.lastName}`,
        appointmentDate: appointmentData.appointmentDate,
      } 
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Loading chat...</Typography>
      </Box>
    );
  }

  if (!appointmentData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6">Appointment not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
      {/* Chat header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        mb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar 
            src={appointmentData.userId?.userPic} 
            sx={{ width: 56, height: 56, mr: 2 }} 
          />
          <Box>
            <Typography variant="h6">
              {appointmentData.firstName} {appointmentData.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointmentData.status === 'Started' ? 'In Consultation' : appointmentData.status}
            </Typography>
          </Box>
        </Box>

        {appointmentData.status === 'Started' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<MedicalServices />}
            onClick={handleCreatePrescription}
            sx={{ ml: 2 }}
          >
            Create Prescription
          </Button>
        )}
      </Box>

      {/* Messages area */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 2,
        p: 2,
        bgcolor: 'background.default',
        borderRadius: 2
      }}>
        <List>
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isOwnMessage={message.sender._id === doctorId}
              currentUser={doctorId}
            />
          ))}
          <TypingIndicator 
            isTyping={isTyping} 
            userType="USER" 
          />
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message input */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 1,
        boxShadow: 1
      }}>
        <IconButton 
          component="label"
          sx={{ mr: 1 }}
        >
          <AttachFile />
          <input
            type="file"
            hidden
            onChange={(e) => setFileInput(e.target.files[0])}
          />
        </IconButton>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          sx={{ mr: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <InsertEmoticon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() && !fileInput}
          size="large"
        >
          <Send />
        </IconButton>
      </Box>

      {fileInput && (
        <Box sx={{ 
          mt: 1,
          p: 1,
          bgcolor: 'action.selected',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ flexGrow: 1 }}>
            {fileInput.name} ({Math.round(fileInput.size / 1024)} KB)
          </Typography>
          <Button 
            size="small" 
            onClick={() => setFileInput(null)}
          >
            Remove
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default DoctorChatPage;