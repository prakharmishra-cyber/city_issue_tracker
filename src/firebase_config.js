
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzRcb6_BtjNZSYUwZwrGvZf5P8FACAPp4",
  authDomain: "issue-tracker-e504b.firebaseapp.com",
  projectId: "issue-tracker-e504b",
  storageBucket: "issue-tracker-e504b.appspot.com",
  messagingSenderId: "213119720442",
  appId: "1:213119720442:web:36c5ba8bc76b92ae76a243",
  measurementId: "G-TZRT9M72HR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);