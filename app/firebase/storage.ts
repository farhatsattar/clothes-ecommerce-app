import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadImage = async (file: File) => {
  const imageRef = ref(storage, `products/${Date.now()}-${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};
