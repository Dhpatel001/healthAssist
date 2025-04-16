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
  Avatar,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send,
  AttachFile,
  InsertEmoticon
} from '@mui/icons-material';
import { MessageItem, TypingIndicator } from '../context/ChatComponents';
import { toast } from 'react-toastify';

const socket = io('http://localhost:3000', {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000
});

export const UserChatPage = () => {
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
  const userId = localStorage.getItem('id');
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  

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
      const updatedAppointment = response.data.data;
      setAppointmentData(updatedAppointment);
      setLoading(false);
      
      // Check if appointment is completed and not reviewed yet
      if (updatedAppointment.status === 'Completed' && !updatedAppointment.review) {
        setShowReviewForm(true);
        toast.info('Please rate your experience with the doctor');
      }
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      toast.error('Failed to load chat data');
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchAppointmentData();

    socket.emit('join_appointment_room', {
      appointmentId,
      userId,
      userType: 'USER'
    });

    // Add socket listener for appointment status updates
    const handleAppointmentCompleted = () => {
      setAppointmentData(prev => ({
        ...prev,
        status: 'Completed'
      }));
      setShowReviewForm(true);
      toast.info('Appointment completed. Please rate your experience.');
    };

    socket.on('appointment_status_update', ({ appointmentId: updatedAppointmentId, status }) => {
      if (updatedAppointmentId === appointmentId && status === 'Completed') {
        handleAppointmentCompleted();
      }
    });

    socket.on('appointment_completed', ({ appointmentId: completedAppointmentId }) => {
      if (completedAppointmentId === appointmentId) {
        handleAppointmentCompleted();
      }
    });

    socket.on('chat_ready', ({ previousMessages }) => {
      const validatedMessages = (previousMessages || []).map(validateMessage);
      setMessages(validatedMessages);
    });

    socket.on('receive_message', (message) => {
      const validatedMessage = validateMessage(message);
      setMessages((prev) => [...prev, validatedMessage]);
      
      if (message.sender._id !== userId) {
        socket.emit('mark_as_read', {
          messageId: validatedMessage._id,
          userId,
          userType: 'USER'
        });
      }
    });

    socket.on('typing', ({ userId: typingUserId, isTyping: typing }) => {
      if (typingUserId !== userId) {
        setIsTyping(typing);
      }
    });

    socket.on('message_read', ({ messageId }) => {
      setMessages(prev => prev.map(msg => 
        msg._id === messageId 
          ? { 
              ...msg, 
              readBy: [...(msg.readBy || []), 
              { userId, readAt: new Date().toISOString() } ]
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
      socket.off('appointment_status_update');
      socket.off('appointment_completed');
      socket.off('chat_ready');
      socket.off('receive_message');
      socket.off('typing');
      socket.off('message_read');
      socket.off('chat_error');
      socket.off('connect_error');
    };
  }, [fetchAppointmentData, userId, appointmentId]);

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
      userId,
      userType: 'USER',
      isTyping: true
    });

    setTypingTimeout(setTimeout(() => {
      socket.emit('typing', {
        appointmentId,
        userId,
        userType: 'USER',
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
        senderId: userId, // or doctorId
        userType: 'USER', // or 'DOCTOR'
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
  
    setIsSubmittingReview(true);
    try {
      const doctorId = appointmentData?.doctorId?._id?.toString() || 
                      appointmentData?.doctorId?.toString();
      
      if (!doctorId) {
        toast.error('Doctor information is not available for this appointment');
        return;
      }
  
      console.log('Submitting review with data:', {
        appointmentId,
        doctorId,
        userId,
        rating,
        review: reviewText
      });
  
      const response = await axios.post('/reviews/create', {
        appointmentId,
        doctorId,
        userId,
        rating,
        review: reviewText
      });
      
      console.log('Review submission response:', response.data);
        
      if (response.data.success) {
        toast.success('Thank you for your review! Redirecting to home page...');
        
        // Update local state to mark as reviewed
        setAppointmentData(prev => ({
          ...prev,
          review: response.data.data || {
            rating,
            review: reviewText,
            createdAt: new Date().toISOString()
          }
        }));
        
        // Wait for 2 seconds before redirecting
        setTimeout(() => {
          navigate('/user/home');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to submit review';
      toast.error(errorMessage);
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      console.error('Error config:', error.config);
    } finally {
      setIsSubmittingReview(false);
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
      {/* Review Dialog */}
      <Dialog 
        open={showReviewForm} 
        onClose={() => setShowReviewForm(false)} 
        fullWidth 
        maxWidth="sm"
        disableEscapeKeyDown
        disableBackdropClick
      >
        <DialogTitle>Rate Your Experience</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <Typography variant="h6">
              How would you rate your experience with Dr. {appointmentData.doctorId?.Firstname}?
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              precision={0.5}
            />
            <TextField
              label="Your Review (Optional)"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with this doctor..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained" 
            disabled={isSubmittingReview || rating === 0}
            sx={{ width: '100%' }}
          >
            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 2, 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        mb: 2
      }}>
        <Avatar 
          src={appointmentData.doctorId?.profilePic} 
          sx={{ width: 56, height: 56, mr: 2 }} 
        />
        <Box>
          <Typography variant="h6">
            Dr. {appointmentData.doctorId?.Firstname} {appointmentData.doctorId?.Lastname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointmentData.status === 'Started' ? 'In Consultation' : 'Appointment'}
            {appointmentData.review && ' • Reviewed'}
          </Typography>
        </Box>
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
              isOwnMessage={message.sender._id === userId}
              currentUser={userId}
            />
          ))}
          <TypingIndicator 
            isTyping={isTyping} 
            userType="DOCTOR" 
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
        boxShadow: 1,
        opacity: appointmentData.status === 'Completed' ? 0.6 : 1
      }}>
        <IconButton 
          component="label"
          sx={{ mr: 1 }}
          disabled={appointmentData.status === 'Completed'}
        >
          <AttachFile />
          <input
            type="file"
            hidden
            onChange={(e) => setFileInput(e.target.files[0])}
            disabled={appointmentData.status === 'Completed'}
          />
        </IconButton>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder={
            appointmentData.status === 'Completed' 
              ? 'This appointment has ended' 
              : 'Type your message...'
          }
          multiline
          maxRows={4}
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          sx={{ mr: 1 }}
          disabled={appointmentData.status === 'Completed'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton disabled={appointmentData.status === 'Completed'}>
                  <InsertEmoticon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        
        <IconButton
          color="primary"
          onClick={handleSendMessage}
          disabled={(!newMessage.trim() && !fileInput) || appointmentData.status === 'Completed'}
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

export default UserChatPage;