import { Platform } from 'react-native';

import { getApp, initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';

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
export const firestore = getFirestore(firebaseApp);
export default firebaseApp;
