import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === category));
    }
  }, [category, products]);

  return (
    <Layout title="Silmara Bolos - Cardápio">
      <div className="bg-primary bg-opacity-10 py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3 md:mb-4">
            Silmara Bolos e Docinhos
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Bolos artesanais e docinhos deliciosos para todas as ocasiões. 
            Feitos com amor e ingredientes de qualidade.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto max-w-full mx-auto">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                category === 'all' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategory('bolo')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                category === 'bolo' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bolos
            </button>
            <button
              onClick={() => setCategory('docinho')}
              className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                category === 'docinho' 
                  ? 'bg-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Docinhos
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 animate-fade">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 md:mb-6">Como Encomendar</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6 md:mb-8">
            Escolha seu produto favorito e clique no botão "Pedir" para enviar uma mensagem via WhatsApp.
            Também aceitamos encomendas personalizadas para ocasiões especiais.
          </p>
          
          <a href="https://wa.me/5542999530903?text=Olá,%20gostaria%20de%20fazer%20uma%20encomenda%20personalizada"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center justify-center bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.72 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
            </svg>
            <span>Fazer Pedido Personalizado</span>
          </a>
        </div>
      </div>
    </Layout>
  );
} 