import React from 'react';
import {
  Box,
  Avatar,
  Paper,
  Typography,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
  styled
} from '@mui/material';
import {
  InsertDriveFile,
  Image,
  Videocam,
  MusicNote,
  CheckCircle,
  Close
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const MessageBubble = styled(Paper)(({ theme, isOwn }) => ({
  padding: theme.spacing(1.5),
  borderRadius: isOwn 
    ? '18px 18px 0 18px' 
    : '18px 18px 18px 0',
  backgroundColor: isOwn 
    ? theme.palette.primary.light 
    : theme.palette.background.paper,
  color: isOwn 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  maxWidth: '100%',
  wordBreak: 'break-word',
  boxShadow: theme.shadows[1]
}));

const Dot = styled(Box)(({ theme }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: theme.palette.text.secondary,
  margin: theme.spacing(0, 0.5),
  animation: `${pulse} 1.5s infinite ease-in-out`,
  animationDelay: '0s'
}));

const AttachmentIcon = ({ type }) => {
  switch (type) {
    case 'image':
      return <Image color="primary" />;
    case 'video':
      return <Videocam color="primary" />;
    case 'audio':
      return <MusicNote color="primary" />;
    default:
      return <InsertDriveFile color="primary" />;
  }
};

const SafeMessageItem = ({ message, isOwnMessage, currentUser, onDelete }) => {
  try {
    // Validate message structure
    const validatedMessage = {
      ...message,
      _id: message._id || Date.now().toString(),
      createdAt: message.createdAt || new Date().toISOString(),
      readBy: message.readBy || [],
      sender: message.sender || { _id: 'unknown', profilePic: '' }
    };

    const isRead = validatedMessage.readBy?.some(r => r.userId === currentUser);
    const readTime = validatedMessage.readBy?.find(r => r.userId === currentUser)?.readAt;

    return (
      <ListItem
        sx={{
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          px: 1,
          py: 0.5
        }}
      >
        {!isOwnMessage && (
          <ListItemAvatar sx={{ minWidth: 40, alignSelf: 'flex-start' }}>
            <Avatar 
              src={validatedMessage.sender.profilePic || validatedMessage.sender.userPic} 
              sx={{ width: 32, height: 32 }}
            />
          </ListItemAvatar>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
          maxWidth: ['calc(100% - 80px)', '70%']
        }}>
          <MessageBubble isOwn={isOwnMessage}>
            {validatedMessage.attachments?.length > 0 && (
              <Box sx={{ mb: validatedMessage.message ? 1 : 0 }}>
                {validatedMessage.attachments.map((file, idx) => (
                  <Chip
                    key={idx}
                    icon={<AttachmentIcon type={file.type} />}
                    label={file.name}
                    onClick={() => window.open(file.url, '_blank')}
                    sx={{ 
                      mr: 1, 
                      mb: 1, 
                      cursor: 'pointer',
                      maxWidth: '100%',
                      '.MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                    size="small"
                  />
                ))}
              </Box>
            )}
            
            {validatedMessage.message && (
              <Typography variant="body2">{validatedMessage.message}</Typography>
            )}
          </MessageBubble>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: 0.5,
            px: 1
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              {formatDistanceToNow(new Date(validatedMessage.createdAt), { addSuffix: true })}
            </Typography>
            
            {isOwnMessage && (
              <Tooltip 
                title={isRead 
                  ? `Read ${formatDistanceToNow(new Date(readTime), { addSuffix: true })}`
                  : 'Delivered'}
                placement="top"
              >
                <CheckCircle
                  fontSize="small"
                  color={isRead ? 'primary' : 'disabled'}
                  sx={{ ml: 0.5, fontSize: '1rem' }}
                />
              </Tooltip>
            )}
            
            {isOwnMessage && onDelete && (
              <IconButton
                size="small"
                onClick={() => onDelete(validatedMessage._id)}
                sx={{ ml: 0.5 }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
      </ListItem>
    );
  } catch (error) {
    console.error('Error rendering message:', error);
    return null;
  }
};

export const MessageItem = React.memo(SafeMessageItem);

export const TypingIndicator = ({ isTyping, userType }) => {
  if (!isTyping) return null;
  
  return (
    <ListItem sx={{ 
      justifyContent: userType === 'DOCTOR' ? 'flex-start' : 'flex-end',
      px: 1,
      py: 0.5
    }}>
      <Paper
        elevation={0}
        sx={{
          p: 1,
          borderRadius: 2,
          bgcolor: 'action.selected'
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Dot sx={{ animationDelay: '0s' }} />
          <Dot sx={{ animationDelay: '0.2s' }} />
          <Dot sx={{ animationDelay: '0.4s' }} />
        </Box>
      </Paper>
    </ListItem>
  );
};

export const FilePreview = ({ file, onRemove }) => {
  const fileSize = (file.size / 1024).toFixed(2);
  
  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      p: 1,
      mb: 1,
      bgcolor: 'action.hover',
      borderRadius: 1
    }}>
      <AttachmentIcon type={file.type.split('/')[0]} />
      <Box sx={{ ml: 1, flexGrow: 1, overflow: 'hidden' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {file.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fileSize} KB
        </Typography>
      </Box>
      <IconButton size="small" onClick={onRemove}>
        <Close fontSize="small" />
      </IconButton>
    </Box>
  );
};

export const SystemMessage = ({ text }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      justifyContent: 'center',
      my: 1
    }}>
      <Typography 
        variant="caption" 
        sx={{ 
          px: 2,
          py: 1,
          bgcolor: 'background.paper',
          borderRadius: 2,
          color: 'text.secondary',
          boxShadow: 1
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};