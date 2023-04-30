// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"
import { getDatabase, serverTimestamp } from "firebase/database"
import { Timestamp } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDsSi48tsgkXXxy8qhS3iNnvl0VVoUpQ_k",
    authDomain: "boiler-room-app.firebaseapp.com",
    databaseURL: "https://boiler-room-app-default-rtdb.firebaseio.com",
    projectId: "boiler-room-app",
    storageBucket: "boiler-room-app.appspot.com",
    messagingSenderId: "797465679240",
    appId: "1:797465679240:web:61f5f1e46bae19e756d63d",
    measurementId: "G-DG25C0YHS6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const analytics = getAnalytics(app)
const storage = getStorage(app)

export { app, database, analytics, serverTimestamp, Timestamp, storage }