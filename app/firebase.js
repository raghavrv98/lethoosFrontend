import firebase from 'firebase/app'
import "firebase/auth"

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDKeNSATK47W8gmeZDxuJlkvEAIOWI2xuI",
    authDomain: "lethoos-9733e.firebaseapp.com",
    projectId: "lethoos-9733e",
    storageBucket: "lethoos-9733e.appspot.com",
    messagingSenderId: "335564795977",
    appId: "1:335564795977:web:ca716b24cb2f0ded12cf98"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase