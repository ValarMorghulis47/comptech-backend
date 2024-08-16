import { v4 as uuid } from "uuid";
import { getBase64 } from '../lib/helper.js';
import {v2 as cloudinary} from 'cloudinary';


const UploadFilesCloudinary = async (file, folder) => {
    try {
        return await cloudinary.uploader.upload(getBase64(file), {
            folder: folder,
            resource_type: "auto",
            public_id: uuid(),
        });
    } catch (error) {
        throw new Error(error);
    }
};

const DeleteFileCloudinary = async (public_id) => {
    try {
      // Use Cloudinary's API to delete the image
      const result = await cloudinary.uploader.destroy(public_id);
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };

export { UploadFilesCloudinary, DeleteFileCloudinary };