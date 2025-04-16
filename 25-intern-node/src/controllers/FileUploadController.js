const { uploadChatAttachmentToCloudinary } = require('../utils/CloudanryUtil');
const multer = require('multer');

// Configure multer for memory storage (handles files as buffers)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleFileUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const result = await uploadChatAttachmentToCloudinary(req.file.buffer, {
      folder: 'chat_attachments',
      public_id: `${Date.now()}_${req.file.originalname}`,
      resource_type: 'auto' // Let Cloudinary detect file type
    });

    res.json({
      success: true,
      url: result.secure_url,
      type: result.resource_type,
      name: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'File upload failed',
      error: error.message 
    });
  }
};

module.exports = { handleFileUpload, upload };