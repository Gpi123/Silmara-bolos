import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, loginWithCustomCredentials, createAdminUser } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, preencha todos os campos');
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      await loginWithCustomCredentials(username, password);
      toast.success('Login realizado com sucesso!');
      router.push('/admin');
    } catch (error) {
      console.error('Erro de login:', error);
      setError('Credenciais inválidas');
      toast.error('Credenciais inválidas. Tente Silmara/231523');
    } finally {
      setLoading(false);
    }
  };

  // Função para criar o usuário admin inicial
  const handleCreateAdminUser = async () => {
    try {
      await createAdminUser();
      toast.success('Usuário administrador criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário admin:', error);
      toast.error('Erro ao criar usuário admin: ' + error.message);
    }
  };

  return (
    <Layout title="Login - Silmara Bolos">
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
              Área Administrativa
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Faça login para gerenciar seus produtos
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Nome de usuário</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Nome de usuário"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Senha"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>

            <div className="text-center text-sm">
              <p className="text-gray-600">Usar: Silmara / 231523</p>
            </div>
          </form>
          
          <div className="text-center pt-4">
            <button
              onClick={handleCreateAdminUser}
              className="text-xs text-primary hover:text-secondary"
            >
              Criar usuário administrador
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 