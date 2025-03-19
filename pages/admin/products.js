import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';
import ProductForm from '../../components/ProductForm';
import ProductList from '../../components/ProductList';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../../services/productService';
import { toast } from 'react-toastify';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNew = () => {
    setCurrentProduct(null);
    setShowForm(true);
  };
  
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowForm(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await deleteProduct(id);
        toast.success('Produto excluído com sucesso');
        loadProducts();
      } catch (error) {
        console.error('Erro ao deletar produto:', error);
        toast.error('Erro ao deletar produto');
      }
    }
  };
  
  const handleSubmit = async (productData, imageFile) => {
    try {
      if (currentProduct) {
        // Atualizando um produto existente
        await updateProduct(currentProduct.id, productData, imageFile);
        toast.success('Produto atualizado com sucesso');
      } else {
        // Adicionando um novo produto
        await addProduct(productData, imageFile);
        toast.success('Produto adicionado com sucesso');
      }
      setShowForm(false);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast.error('Erro ao salvar produto');
    }
  };
  
  const handleCancel = () => {
    setShowForm(false);
  };
  
  return (
    <Layout>
      <Head>
        <title>{showForm ? 'Gerenciar Produto' : 'Produtos'} | Admin - Silmara Bolos</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {showForm ? (
          <div>
            <h1 className="text-2xl font-bold mb-6">
              {currentProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </h1>
            <ProductForm 
              product={currentProduct}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Produtos</h1>
              <div className="flex gap-2 items-center">
                <Link href="/admin/configurar-regras">
                  <a className="text-blue-600 hover:text-blue-800 flex items-center mr-3">
                    <span className="mr-1">⚠️</span> Configurar Regras
                  </a>
                </Link>
                <button
                  onClick={handleAddNew}
                  className="btn btn-primary"
                >
                  Adicionar Produto
                </button>
              </div>
            </div>
            
            {loading ? (
              <p className="text-center py-10">Carregando produtos...</p>
            ) : (
              <ProductList 
                products={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
} 