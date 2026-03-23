import { storage } from '../config/firebase';

export const uploadImageToStorage = async (file: Express.Multer.File, folder: string): Promise<string> => {
  const bucket = storage.bucket(); 
  const ext = file.originalname.split('.').pop() || 'png';
  const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  
  const ref = bucket.file(fileName);
  // Using firebase-admin to save the uploaded buffer
  await ref.save(file.buffer, {
    metadata: { contentType: file.mimetype }
  });
  
  // Generating a highly durable signed URL simulating a public read
  const [url] = await ref.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  });
  
  return url;
};
