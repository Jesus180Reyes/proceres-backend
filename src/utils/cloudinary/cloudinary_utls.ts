/* eslint-disable @typescript-eslint/no-explicit-any */
import {config} from 'dotenv';
config();
import {ImageFormat, VideoFormat, v2 as cloudinary} from 'cloudinary';
          

export class CloudinaryUtils {
  public allowed_formats: VideoFormat[] | ImageFormat[];
    constructor(allowed_formats:VideoFormat[] | ImageFormat[]) {
      this.allowed_formats = allowed_formats;
        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_APIKEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET 
          });
    }
       uploadFile = async( file: string, folder: string) => {
      try {
        const result = await cloudinary.uploader.upload(file,
        { 
          public_id: crypto.randomUUID(),  
          allowed_formats: this.allowed_formats,
          folder: folder,
          // notification_url: 'https://discord.com/api/webhooks/1231872153633165345/B-w3kU884-UpOP1xkcz-CQbXqEhm1zBZI98WptXty95s_DtWKgQq18SEEkfqkjAM7jJH/cloudinary',
          // eager_notification_url: 'https://discord.com/api/webhooks/1231872153633165345/B-w3kU884-UpOP1xkcz-CQbXqEhm1zBZI98WptXty95s_DtWKgQq18SEEkfqkjAM7jJH/cloudinary'
        }, 
        
        )
        return result
        
      } catch (error:any) {
        console.error(`Error de Subida de Archivo: ${error.message}`);
        return error
      }
    }
}