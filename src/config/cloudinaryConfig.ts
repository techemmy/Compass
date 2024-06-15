import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
};
cloudinary.config(CLOUDINARY_CONFIG);

export default cloudinary;
