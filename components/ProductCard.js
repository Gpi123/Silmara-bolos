import CustomImage from './CustomImage';
import { FaWhatsapp } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { name, price, imageURL, description } = product;
  
  const handleWhatsAppOrder = () => {
    const message = `Olá, gostaria de encomendar: ${name}`;
    const phoneNumber = '5542999530903'; // Substitua pelo seu número de WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="card group">
      <div className="relative h-56 sm:h-64 overflow-hidden">
        {imageURL ? (
          <CustomImage 
            src={imageURL} 
            alt={name}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Sem imagem</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-serif text-lg sm:text-xl font-semibold">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            R$ {Number(price).toFixed(2).replace('.', ',')}
          </span>
          <button 
            onClick={handleWhatsAppOrder}
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
            aria-label="Fazer pedido via WhatsApp"
          >
            <FaWhatsapp size={18} />
            <span className="text-sm font-medium">Pedir</span>
          </button>
        </div>
      </div>
    </div>
  );
} 