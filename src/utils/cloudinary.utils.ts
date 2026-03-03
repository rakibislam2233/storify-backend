import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { StatusCodes } from 'http-status-codes';
import ApiError from './ApiError';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

/**
 * Uploads a file buffer to Cloudinary.
 */
export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folderName: string = 'storify/general',
  fileName?: string,
  mimeType?: string
): Promise<UploadApiResponse> => {
  try {
    // Convert Buffer to Base64 Data URI
    const base64Data = fileBuffer.toString('base64');
    const fileUri = `data:${mimeType || 'application/octet-stream'};base64,${base64Data}`;

    // Upload options
    const options: any = {
      folder: folderName,
      resource_type: 'auto', // Automatically detects image, video, or raw (PDF/Audio)
      public_id: fileName || `file_${Date.now()}`,
      overwrite: true,
    };

    // Perform Upload
    const result = await cloudinary.uploader.upload(fileUri, options);

    return result;
  } catch (error: any) {
    console.error('❌ Cloudinary Upload Error:', error);
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Cloudinary upload failed: ${error.message}`
    );
  }
};

/**
 * Deletes a file from Cloudinary using its public_id.
 */
export const deleteFromCloudinary = async (
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'raw'
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error: any) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `Cloudinary deletion failed: ${error.message}`
    );
  }
};

export const CloudinaryUtils = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
