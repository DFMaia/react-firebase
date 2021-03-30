import firebase from 'firebase/app';
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyBr_RqSSOC-bMdZlsuhYktdfpNolT0Gsa8",
    authDomain: "curso-react-3b0c9.firebaseapp.com",
    projectId: "curso-react-3b0c9",
    storageBucket: "curso-react-3b0c9.appspot.com",
    messagingSenderId: "1075864389955",
    appId: "1:1075864389955:web:98c08a4713a8e83d6847f6",
    measurementId: "G-N377KBWKK8"
  };

  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }

  export default firebase;