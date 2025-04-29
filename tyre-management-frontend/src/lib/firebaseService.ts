import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const uploadFile = async (file: File, path: string) => {
  try {
    const fileRef = ref(storage, path);
    const snapshot = await uploadBytesResumable(fileRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
};
