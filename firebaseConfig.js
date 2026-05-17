import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0eJYSBBaKJQQtPI3rhWJU3hRVIDsCDOM",
  authDomain: "event-planner-app-55e54.firebaseapp.com",
  projectId: "event-planner-app-55e54",
  storageBucket: "event-planner-app-55e54.firebasestorage.app",
  messagingSenderId: "917124647066",
  appId: "1:917124647066:web:500b0a4584d37782973723",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;