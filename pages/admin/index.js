import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProductList from '../../components/ProductList';
import ProductForm from '../../components/ProductForm';
import { 
  getAllProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/productService';

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast.error('Erro ao carregar produtos');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [refreshKey]);

  const handleAddProduct = async (productData, imageFile) => {
    try {
      await addProduct(productData, imageFile);
      toast.success('Produto adicionado com sucesso!');
      setIsFormOpen(false);
      setRefreshKey(prev => prev + 1); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      toast.error('Erro ao adicionar produto');
    }
  };

  const handleUpdateProduct = async (productData, imageFile) => {
    try {
      await updateProduct(currentProduct.id, productData, imageFile);
      toast.success('Produto atualizado com sucesso!');
      setIsFormOpen(false);
      setCurrentProduct(null);
      setRefreshKey(prev => prev + 1); // Atualiza a lista
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast.error('Erro ao atualizar produto');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto excluído com sucesso!');
        setRefreshKey(prev => prev + 1); // Atualiza a lista
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast.error('Erro ao excluir produto');
      }
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setCurrentProduct(null);
  };

  const handleSubmit = (productData, imageFile) => {
    if (currentProduct) {
      handleUpdateProduct(productData, imageFile);
    } else {
      handleAddProduct(productData, imageFile);
    }
  };

  return (
    <ProtectedRoute>
      <Layout title="Administração - Silmara Bolos" isAdmin={true}>
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="mb-8 md:mb-10 mt-4 md:mt-6">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-6 md:mb-8">
              Gerenciar Produtos
            </h1>
            
            {!isFormOpen && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full md:w-auto btn btn-primary py-3 md:py-2 text-center"
              >
                Adicionar Novo Produto
              </button>
            )}
          </div>
          
          {isFormOpen ? (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 animate-fade">
              <h2 className="text-xl md:text-2xl font-serif font-bold mb-4 md:mb-6">
                {currentProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h2>
              <ProductForm 
                product={currentProduct}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 animate-fade">
              <ProductList 
                products={products}
                onEdit={handleEdit}
                onDelete={handleDeleteProduct}
              />
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
} 