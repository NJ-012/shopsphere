import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  params: {
    folder: (req, file) => {
      if (req.path.includes('avatar')) return 'shopsphere/avatars';
      if (req.path.includes('snapshot')) return 'shopsphere/snapshots';
      return 'shopsphere/products';
    },
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto:good' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadSingle = upload.single('image');
export const uploadMultiple = upload.array('images', 8);
export const uploadAvatar = upload.single('avatar');

