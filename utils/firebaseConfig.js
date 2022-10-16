import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "tournament-db618.appspot.com",
  messagingSenderId: "405584158959",
  appId: "1:405584158959:web:f12145a4dc09cdd767bb1a",
  measurementId: "G-BMDW38PDGB"
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

export const signOut = () => {
  auth.signOut();
}


export const getDocRef = (collectionName, docName) => {
  if (typeof collectionName == 'object') return doc(collectionName, docName);
  return doc(firestore, collectionName, docName);
}
export const getCollectionRef = (arg1, arg2) => {
  if (arg2) return collection(arg1, arg2);
  return collection(firestore, arg1);
}
export const newDoc = (collectionName, data) => {
  return addDoc(getCollectionRef(collectionName), data);
}
export const newDocInRef = (ref, data) => {
  return addDoc(ref, data);
}
export const setDocByRef = (ref, data) => {
  return setDoc(ref, data);
}
export const readDoc = async (collectionName, docName) => {
  const docRef = getDocRef(collectionName, docName);
  const docData = await getDoc(docRef)
  if (docData.exists()) return docData.data();
  return null;
}
export const readDocByRef = async (ref) => {
  const docData = await getDoc(ref)
  if (docData.exists()) return docData.data();
  return null;
}
export const getUser = () => {
  return auth.currentUser;
}