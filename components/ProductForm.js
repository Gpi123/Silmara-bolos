import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import CustomImage from './CustomImage';

export default function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'bolo', // 'bolo' ou 'docinho'
    imageURL: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Campo para URL de imagem externa
  const [externalImageURL, setExternalImageURL] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        category: product.category || 'bolo',
        imageURL: product.imageURL || '',
      });
      
      if (product.imageURL) {
        setImagePreview(product.imageURL);
        setExternalImageURL(product.imageURL);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'price') {
      // Aceita apenas números e ponto/vírgula para o preço
      const sanitizedValue = value.replace(/[^0-9.,]/g, '');
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter menos de 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Função para lidar com mudanças na URL da imagem externa
  const handleExternalImageURLChange = (e) => {
    const url = e.target.value;
    setExternalImageURL(url);
    setImagePreview(url);
    setFormData(prev => ({ ...prev, imageURL: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error('Por favor, preencha nome e preço do produto');
      return;
    }
    
    try {
      setLoading(true);
      
      // Formatando o preço para número antes de enviar
      const formattedData = {
        ...formData,
        price: parseFloat(formData.price.replace(',', '.')),
        imageURL: externalImageURL || formData.imageURL  // Usar URL externa se disponível
      };
      
      await onSubmit(formattedData, imageFile);
      setLoading(false);
      
      // Resetar formulário após submissão bem-sucedida
      if (!product) {
        setFormData({
          name: '',
          price: '',
          description: '',
          category: 'bolo',
          imageURL: ''
        });
        setImageFile(null);
        setImagePreview('');
        setExternalImageURL('');
      }
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Erro ao salvar produto');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do Produto*
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
          placeholder="Ex: Bolo de Chocolate"
          required
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preço (R$)*
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
            placeholder="Ex: 39,90"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
          >
            <option value="bolo">Bolo</option>
            <option value="docinho">Docinho</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base h-24"
          placeholder="Descreva seu produto..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL da Imagem (Cole link de uma imagem da internet)
        </label>
        <input
          type="text"
          value={externalImageURL}
          onChange={handleExternalImageURLChange}
          className="w-full px-3 py-3 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
          placeholder="Ex: https://exemplo.com/imagem.jpg"
        />
        <p className="mt-1 text-xs text-gray-500">
          Cole o link de uma imagem da internet para exibir no cardápio
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ou faça upload de uma imagem (Temporariamente desativado)
        </label>
        <input
          type="file"
          accept="image/*"
          disabled={true}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-gray-300 file:text-gray-600
            hover:file:bg-gray-200"
        />
        <p className="mt-1 text-xs text-gray-500">
          Upload desativado temporariamente. Use a URL da imagem acima.
        </p>
      </div>
      
      {imagePreview && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
          <div className="relative h-40 w-40 border rounded-md overflow-hidden">
            <CustomImage 
              src={imagePreview} 
              alt="Pré-visualização" 
              className="rounded-md"
            />
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 pt-3">
        <button
          type="submit"
          className="btn btn-primary py-3 sm:py-2 flex-grow sm:flex-grow-0 order-2 sm:order-1"
          disabled={loading}
        >
          {loading ? 'Salvando...' : product ? 'Atualizar Produto' : 'Adicionar Produto'}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-outline py-3 sm:py-2 flex-grow sm:flex-grow-0 order-1 sm:order-2"
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
} 