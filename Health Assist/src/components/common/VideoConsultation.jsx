// src/components/telemedicine/VideoConsultation.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Typography, CircularProgress, IconButton, TextField } from '@mui/material';
import { Videocam, VideocamOff, Mic, MicOff, CallEnd, Chat, ScreenShare, StopScreenShare } from '@mui/icons-material';
import axios from 'axios';

const VideoConsultation = () => {
  const { appointmentId } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await axios.get(`/telemedicine/${appointmentId}`);
        setConsultation(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load consultation');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultation();
  }, [appointmentId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      const response = await axios.post(`/telemedicine/${appointmentId}/chat`, {
        message: newMessage
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute functionality with WebRTC
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Implement actual video toggle functionality with WebRTC
  };

  const toggleScreenShare = () => {
    setIsSharingScreen(!isSharingScreen);
    // Implement screen sharing functionality with WebRTC
  };

  const endCall = async () => {
    try {
      await axios.post(`/telemedicine/${appointmentId}/end`);
      // Redirect to consultation summary page
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Video Area */}
      <Box sx={{ flex: 3, p: 2 }}>
        <Card sx={{ height: '70vh', mb: 2 }}>
          <CardContent sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {consultation ? (
              <Box>
                <Typography variant="h6">Consultation with Dr. {consultation.doctorId.Firstname}</Typography>
                {/* Video element would go here */}
                <Box sx={{ width: '100%', height: '400px', bgcolor: 'grey.200', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Typography>{isVideoOff ? 'Video is off' : 'Video feed would appear here'}</Typography>
                </Box>
              </Box>
            ) : (
              <Typography>No active consultation found</Typography>
            )}
          </CardContent>
        </Card>

        {/* Call Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <IconButton color={isMuted ? 'error' : 'primary'} onClick={toggleMute}>
            {isMuted ? <MicOff /> : <Mic />}
          </IconButton>
          <IconButton color={isVideoOff ? 'error' : 'primary'} onClick={toggleVideo}>
            {isVideoOff ? <VideocamOff /> : <Videocam />}
          </IconButton>
          <IconButton color={isSharingScreen ? 'primary' : 'default'} onClick={toggleScreenShare}>
            {isSharingScreen ? <StopScreenShare /> : <ScreenShare />}
          </IconButton>
          <Button 
            variant="contained" 
            color="error" 
            startIcon={<CallEnd />}
            onClick={endCall}
          >
            End Call
          </Button>
        </Box>
      </Box>

      {/* Chat Area */}
      <Box sx={{ flex: 1, p: 2, borderLeft: '1px solid #ddd' }}>
        <Typography variant="h6" gutterBottom>Chat</Typography>
        <Box sx={{ height: '60vh', overflowY: 'auto', mb: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {msg.sender === 'doctor' ? 'Dr.' : 'You'} at {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
              <Typography>{msg.content}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
          />
          <Button 
            variant="contained" 
            startIcon={<Chat />}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoConsultation;