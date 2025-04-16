import { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
  InputAdornment
} from '@mui/material';
import { Send } from '@mui/icons-material';

export const ChatComponent = ({ appointmentId, otherUser }) => {
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false since we'll try to work without initial load
  const [error, setError] = useState(null);
  const [appointmentStatus, setAppointmentStatus] = useState('Started'); // Default to started to allow sending
  const userId = localStorage.getItem('id');
  const userRole = localStorage.getItem('role'); // 'USER' or 'DOCTOR'

  useEffect(() => {
    if (!socket || !appointmentId) return;
  
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Join the appointment room first
        socket.emit('join_appointment_room', { 
          appointmentId, 
          userId 
        });
  
        // Set up a timeout for the initial connection
        const connectionTimeout = setTimeout(() => {
          if (messages.length === 0) {
            setError('Connection is slow - messages may take longer to load');
          }
        }, 5000);
  
        // Try to get existing messages
        try {
          const messagesRes = await axios.get('/chat', {
            params: { appointment: appointmentId },
            timeout: 3000
          });
          setMessages(messagesRes.data);
        } catch (e) {
          console.warn('Could not load initial messages, starting with empty chat');
          setMessages([]);
        }
  
        clearTimeout(connectionTimeout);
  
      } catch (err) {
        console.error('Error in initial setup:', err);
        setError('Failed to establish connection. Trying to reconnect...');
        // Attempt to reconnect after 5 seconds
        setTimeout(fetchInitialData, 5000);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInitialData();
  
    // Set up message listener
    const handleNewMessage = (data) => {
      if (data.appointment === appointmentId) {
        setMessages(prev => [...prev, data]);
        setError(null); // Clear any previous errors when we receive a message
      }
    };
  
    const handleChatReady = () => {
      setError(null); // Clear errors when connection is established
    };
  
    socket.on('receive_message', handleNewMessage);
    socket.on('chat_error', (error) => {
      setError(error.message);
    });
    socket.on('chat_ready', handleChatReady);
  
    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_error');
      socket.off('chat_ready', handleChatReady);
    };
  }, [socket, appointmentId, userId]);

  const sendMessage = async () => {
    if (!message.trim() || !socket) return;

    try {
      // Create optimistic update
      const tempId = Date.now().toString();
      const newMessage = {
        _id: tempId,
        sender: { _id: userId, Firstname: 'You', Lastname: '' },
        message: message.trim(),
        timestamp: new Date(),
        appointment: appointmentId,
        isOptimistic: true
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Emit via socket
      socket.emit('send_appointment_message', {
        appointmentId,
        senderId: userId,
        senderRole: userRole,
        message: message.trim()
      });

      // If optimistic message is still there after 5 seconds, remove it
      setTimeout(() => {
        setMessages(prev => prev.filter(msg => msg._id !== tempId));
      }, 5000);

    } catch (err) {
      setError('Failed to send message');
      console.error('Send message error:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center' }}>
        <Avatar src={otherUser?.profilePic} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="h6">
            {otherUser?.Firstname} {otherUser?.Lastname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error ? 'Connection issues - messages may not sync' : 'Chat active'}
          </Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        {messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {error ? 'Connection issues - messages may not load' : 'No messages yet. Start the conversation!'}
          </Typography>
        ) : (
          <List>
            {messages.map((msg) => (
              <ListItem 
                key={msg._id}
                sx={{
                  justifyContent: msg.sender._id === userId ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  px: 0,
                  opacity: msg.isOptimistic ? 0.7 : 1
                }}
              >
                <Box sx={{
                  display: 'flex',
                  flexDirection: msg.sender._id === userId ? 'row-reverse' : 'row',
                  alignItems: 'flex-start',
                  maxWidth: '80%'
                }}>
                  {msg.sender._id !== userId && (
                    <Avatar 
                      src={msg.sender?.profilePic} 
                      sx={{ width: 32, height: 32, mx: 1 }}
                    />
                  )}
                  <Paper sx={{
                    p: 1.5,
                    bgcolor: msg.sender._id === userId ? 'primary.light' : 'grey.100',
                    borderRadius: msg.sender._id === userId ? 
                      '18px 18px 0 18px' : '18px 18px 18px 0'
                  }}>
                    <Typography variant="body1">{msg.message}</Typography>
                    <Typography variant="caption" display="block" sx={{ 
                      textAlign: 'right', 
                      color: 'text.secondary',
                      mt: 0.5
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.isOptimistic && ' (Sending...)'}
                    </Typography>
                  </Paper>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      {/* Message Input */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={error ? "Trying to reconnect..." : "Type your message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={!!error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                paddingRight: '8px'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    color="primary" 
                    onClick={sendMessage}
                    disabled={!message.trim() || !!error}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
            {error} - You can still try to send messages
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChatComponent;