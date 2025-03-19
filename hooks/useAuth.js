import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase/config';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função simplificada para login sem depender do Firebase
  const loginWithCustomCredentials = async (username, password) => {
    try {
      // Verificamos as credenciais diretamente
      if (username === 'Silmara' && password === '231523') {
        // Criamos um usuário fictício
        const mockUser = {
          uid: '123456',
          email: 'admin@silmarabolos.com',
          displayName: 'Administrador'
        };
        
        // Salvamos no localStorage para persistir entre recarregamentos
        localStorage.setItem('authUser', JSON.stringify(mockUser));
        
        // Atualizamos o estado
        setUser(mockUser);
        return { user: mockUser };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro de login:', error);
      throw error;
    }
  };

  // Verificar se já existe um usuário no localStorage ao carregar
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('authUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      setLoading(false);
    }
    
    // Mantemos o código original comentado para referência futura
    /*
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
    */
  }, []);

  // Função de logout adaptada
  const logout = async () => {
    try {
      localStorage.removeItem('authUser');
      setUser(null);
      // Mantemos o código original comentado
      // await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  // Funções originais mantidas para referência futura
  const login = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const createAdminUser = async () => {
    try {
      return await createUserWithEmailAndPassword(auth, 'admin@silmarabolos.com', 'Admin@231523');
    } catch (error) {
      console.error('Erro ao criar usuário admin:', error);
      throw new Error(error.message);
    }
  };

  return {
    user,
    loading,
    login,
    loginWithCustomCredentials,
    createAdminUser,
    logout
  };
} 