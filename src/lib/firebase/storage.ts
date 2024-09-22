
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


//These are not secrets and no problem if 
//these are exposed..
const firebaseConfig = {
  apiKey: "AIzaSyCq_6T001Hq4tlyzoAqvDIFqAZIAl23e1k",
  authDomain: "question-platform-60c03.firebaseapp.com",
  projectId: "question-platform-60c03",
  storageBucket: "question-platform-60c03.appspot.com",
  messagingSenderId: "224222510107",
  appId: "1:224222510107:web:c62f627e21d54871488cbe",
  measurementId: "G-YKKTG7Y2GS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
