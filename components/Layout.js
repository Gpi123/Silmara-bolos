import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children, title = 'Silmara Bolos', isAdmin = false }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Cardápio de bolos e docinhos - Silmara Bolos" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <header className="bg-white shadow-md py-4 md:py-5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-2xl md:text-3xl font-serif font-bold text-primary">
            Silmara Bolos
          </Link>
          
          {isAdmin && user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:inline">Olá, Administrador</span>
              <button 
                onClick={handleLogout}
                className="btn btn-outline text-sm py-2 px-3 md:px-4"
              >
                Sair
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Silmara Bolos - Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
} 