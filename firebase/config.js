import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAQFZSFyiWUQlxOaDFQmbxCO7fqt3b2QQ0",
  authDomain: "silmara-bolos.firebaseapp.com",
  projectId: "silmara-bolos",
  storageBucket: "silmara-bolos.appspot.com",
  messagingSenderId: "329476813572",
  appId: "1:329476813572:web:d2c60bb3ae3bbf6d0c4a08"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa serviços
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app; 