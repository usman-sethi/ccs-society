import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dppwgwy1v',
  api_key: process.env.CLOUDINARY_API_KEY || '218685277464572',
  api_secret: process.env.CLOUDINARY_API_SECRET || '0I6ZWDIEfPMtWzz5jo6tfxGXaBY',
});

export async function uploadImage(base64Image: string, folder: string = 'ccs-society'): Promise<string> {
  if (!base64Image || !base64Image.startsWith('data:image')) {
    return base64Image; // Return as is if it's already a URL or empty
  }

  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder,
      upload_preset: 'ccs-society',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}
