import { useState } from 'react';
import CustomImage from './CustomImage';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

export default function ProductList({ products, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || product.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex-shrink-0 sm:w-auto w-full">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todos os Produtos</option>
            <option value="bolo">Bolos</option>
            <option value="docinho">Docinhos</option>
          </select>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum produto encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="sm:hidden space-y-4 px-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center p-3 border-b">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden mr-3">
                    {product.imageURL ? (
                      <CustomImage 
                        src={product.imageURL} 
                        alt={product.name}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{product.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.category === 'bolo' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {product.category === 'bolo' ? 'Bolo' : 'Docinho'}
                      </span>
                      <span className="text-primary font-bold">
                        R$ {Number(product.price).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end p-2 bg-gray-50">
                  <button 
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:text-blue-900 p-2 mx-1"
                    title="Editar"
                  >
                    <FaEdit size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900 p-2 mx-1"
                    title="Excluir"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:block">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left">Imagem</th>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Categoria</th>
                  <th className="py-3 px-4 text-left">Preço</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        {product.imageURL ? (
                          <CustomImage 
                            src={product.imageURL} 
                            alt={product.name}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-400">Sem imagem</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.category === 'bolo' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {product.category === 'bolo' ? 'Bolo' : 'Docinho'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      R$ {Number(product.price).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => onEdit(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => onDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Excluir"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 