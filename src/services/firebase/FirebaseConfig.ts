import { Platform } from 'react-native';

import { getApp, initializeApp } from '@firebase/app';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

// web requires dynamic initialization on web prior to using firebase
if (Platform.OS === 'web') {
    const firebaseConfig = {
        apiKey: "AIzaSyDeAt7M84IJkMxBHGQncZ2_CDROezzqsMA",
        authDomain: "syn-kn-pawplan.firebaseapp.com",
        projectId: "syn-kn-pawplan",
        storageBucket: "syn-kn-pawplan.firebasestorage.app",
        messagingSenderId: "270992856037",
        appId: "1:270992856037:web:e906d85fac9ab40dda150c"
    };
    initializeApp(firebaseConfig);
}

const firebaseApp = getApp();

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseDatabase = getFirestore(firebaseApp);
export default firebaseApp;
