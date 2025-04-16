// const cloundinary = require("cloudinary").v2;


// const uploadFileToCloudinary = async (file) => {

//     //conif
//         cloundinary.config({
//         cloud_name:"dowozild4",
//         api_key:"441841664611279",
//         api_secret:"yZfZtW8WVFbZx16fu1KGDgZNAGk"
//     })

//     const cloundinaryResponse = await cloundinary.uploader.upload(file.path);
//     return cloundinaryResponse;



// };
// module.exports = {
//     uploadFileToCloudinary
// }


const cloudinary = require("cloudinary").v2;

// Configure Cloudinary once when the app starts
cloudinary.config({
  cloud_name: "dowozild4",
  api_key: "441841664611279",
  api_secret: "yZfZtW8WVFbZx16fu1KGDgZNAGk"
});

// Original function (keeps existing behavior for other parts of your app)
const uploadFileToCloudinary = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result;
};

// New function specifically for chat attachments (uses buffer upload)
const uploadChatAttachmentToCloudinary = async (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Create a buffer stream and pipe to Cloudinary
    const { Readable } = require('stream');
    const stream = Readable.from(fileBuffer);
    stream.pipe(uploadStream);
  });
};

module.exports = {
  uploadFileToCloudinary,       // Original function (for backward compatibility)
  uploadChatAttachmentToCloudinary // New function for chat attachments
};