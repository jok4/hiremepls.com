import { db, storage } from "./firebaseConfig";
import { ref, deleteObject } from "firebase/storage";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const collectionName = process.env.NEXT_PUBLIC_FIREBASE_COLLECTION_NAME || "default_collection_name";

export async function handleDeleteResume(hash: string, deletionCode: string) {
  try {
    const q = query(
      collection(db, collectionName),
      where("hash", "==", hash),
    );
    const querySnapshot = await getDocs(q);

    const document = querySnapshot.docs[0];
    const docRef = doc(db, collectionName, document.id);

    if (
      deletionCode !== process.env.NEXT_PUBLIC_DEFAULT_DELETION_CODE &&
      deletionCode !== document.data().deletionCode
    ) {
      throw new Error("Invalid deletion code or resume not found.");
    }

    await deleteDoc(docRef);

    const fileRef = ref(storage, `${process.env.NEXT_PUBLIC_STORAGE_FOLDER}/${hash}.pdf`);
    await deleteObject(fileRef);

    return true;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
}


export function generateSecureRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
}


// import { db, storage } from "./firebaseConfig"; // Sharan: add this line
// import { ref, deleteObject } from "firebase/storage"; // Sharan: add this line
// import { type ClassValue, clsx } from "clsx"
// import { twMerge } from "tailwind-merge"
// import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";

 
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs))
// }

// export async function handleDeleteResume(hash: string, deletionCode: string) {
//   try {
//     // Query the Firestore collection to find the document with matching hash AND deletion code
//     const q = query(
//       collection(db, "resumes"), 
//       where("hash", "==", hash),
//     );
//     const querySnapshot = await getDocs(q);

//     // Get the document reference
//     const document = querySnapshot.docs[0];
//     const docRef = doc(db, "resumes", document.id);

//     if (deletionCode != "masterdelete498" && deletionCode != document.data().deletionCode) {
//           throw new Error("Invalid deletion code or resume not found.");
//     }

//     // Delete the document from Firestore
//     await deleteDoc(docRef);

//     // Delete the file from Firebase Storage
//     const fileRef = ref(storage, `resumes/${hash}.pdf`);
//     await deleteObject(fileRef);

//     return true; // Return success
//   } catch (error) {
//     console.error("Error deleting resume:", error);
//     throw error; // Propagate the error to be handled by the UI
//   }
// }

// export function generateSecureRandomString(length: number): string {
//   const array = new Uint8Array(length);
//   crypto.getRandomValues(array);
//   return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').slice(0, length);
// }