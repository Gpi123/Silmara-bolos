import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app, db, storage } from '../firebase/config';

const COLLECTION_NAME = 'products';
const LOCAL_STORAGE_KEY = 'localProducts';

// Função para obter o ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Função para inicializar o localStorage com alguns produtos de exemplo
const initializeLocalStorage = () => {
  const exampleProducts = [
    {
      id: generateId(),
      name: 'Bolo de Chocolate',
      price: 45.99,
      description: 'Delicioso bolo de chocolate com cobertura cremosa',
      category: 'bolo',
      imageURL: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1089&q=80',
      createdAt: new Date()
    },
    {
      id: generateId(),
      name: 'Brigadeiros Gourmet',
      price: 2.99,
      description: 'Brigadeiros artesanais com chocolate belga',
      category: 'docinho',
      imageURL: 'https://images.unsplash.com/photo-1589375045402-0d8f1b33b229?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      createdAt: new Date()
    }
  ];
  
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exampleProducts));
  return exampleProducts;
};

// Obter todos os produtos
export const getAllProducts = async () => {
  try {
    // Primeiro tentamos usar o localStorage
    let products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    // Se não houver produtos, inicializamos com exemplos
    if (products.length === 0) {
      products = initializeLocalStorage();
    }
    
    // Ordenamos por nome
    products.sort((a, b) => a.name.localeCompare(b.name));
    
    return products;
    
    /* Código original do Firebase - mantido para referência
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    */
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Obter um produto pelo ID
export const getProductById = async (id) => {
  try {
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const product = products.find(p => p.id === id);
    
    if (product) {
      return product;
    } else {
      throw new Error('Produto não encontrado');
    }
    
    /* Código original do Firebase - mantido para referência
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Produto não encontrado');
    }
    */
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    throw error;
  }
};

// Adicionar um novo produto
export const addProduct = async (productData, imageFile) => {
  try {
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    
    let imageURL = '';
    
    // Se for uma imagem do tipo File, simularemos upload usando URL.createObjectURL
    if (imageFile instanceof File) {
      // No ambiente real, faríamos upload para o Firebase
      // Aqui, apenas salvamos a URL da imagem fornecida ou usamos uma URL placeholder
      imageURL = productData.imageURL || 'https://via.placeholder.com/300';
    } else if (productData.imageURL) {
      // Se já tiver uma URL de imagem no productData, usamos ela
      imageURL = productData.imageURL;
    }
    
    // Criar novo produto
    const newProduct = {
      id: generateId(),
      ...productData,
      imageURL,
      createdAt: new Date()
    };
    
    // Adicionar ao array de produtos
    products.push(newProduct);
    
    // Salvar no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    
    return newProduct;
    
    /* Código original do Firebase - mantido para referência
    let imageURL = '';
    
    // Se houver uma imagem, fazer upload para o Storage
    if (imageFile) {
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(storageRef);
    }
    
    // Adicionar o produto no Firestore com a URL da imagem
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      imageURL,
      createdAt: new Date()
    });
    
    return { id: docRef.id, ...productData, imageURL };
    */
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    throw error;
  }
};

// Atualizar um produto existente
export const updateProduct = async (id, productData, imageFile) => {
  try {
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Produto não encontrado');
    }
    
    let imageURL = productData.imageURL || '';
    
    // Se for uma imagem do tipo File, atualizamos a URL
    if (imageFile instanceof File) {
      // No ambiente real, faríamos upload para o Firebase
      // Aqui, apenas atualizamos a URL da imagem
      imageURL = productData.imageURL || 'https://via.placeholder.com/300';
    }
    
    // Atualizar o produto
    const updatedProduct = {
      ...products[index],
      ...productData,
      imageURL,
      updatedAt: new Date()
    };
    
    // Substituir no array
    products[index] = updatedProduct;
    
    // Salvar no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    
    return updatedProduct;
    
    /* Código original do Firebase - mantido para referência
    const productRef = doc(db, COLLECTION_NAME, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Produto não encontrado');
    }
    
    let imageURL = productData.imageURL || '';
    
    // Se houver uma nova imagem, fazer upload e atualizar a URL
    if (imageFile) {
      // Se já existir uma imagem anterior, deletá-la
      if (productSnap.data().imageURL) {
        try {
          const oldImageRef = ref(storage, productSnap.data().imageURL);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('Imagem anterior não encontrada no storage');
        }
      }
      
      // Fazer upload da nova imagem
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageURL = await getDownloadURL(storageRef);
    }
    
    // Atualizar o produto no Firestore
    await updateDoc(productRef, {
      ...productData,
      imageURL,
      updatedAt: new Date()
    });
    
    return { id, ...productData, imageURL };
    */
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    throw error;
  }
};

// Deletar um produto
export const deleteProduct = async (id) => {
  try {
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error('Produto não encontrado');
    }
    
    // Salvar produtos atualizados no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredProducts));
    
    return id;
    
    /* Código original do Firebase - mantido para referência
    const productRef = doc(db, COLLECTION_NAME, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Produto não encontrado');
    }
    
    // Se houver uma imagem, deletá-la do Storage
    if (productSnap.data().imageURL) {
      try {
        const imageRef = ref(storage, productSnap.data().imageURL);
        await deleteObject(imageRef);
      } catch (error) {
        console.log('Imagem não encontrada no storage');
      }
    }
    
    // Deletar o produto do Firestore
    await deleteDoc(productRef);
    
    return id;
    */
  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    throw error;
  }
};

// Função simplificada para upload de imagens
export const uploadImage = async (file) => {
  try {
    if (!file) {
      console.log("Nenhum arquivo fornecido");
      return null;
    }
    
    console.log("Iniciando upload da imagem:", file.name, "Tamanho:", Math.round(file.size/1024), "KB");
    
    // Verifica se o storage está disponível
    if (storage) {
      try {
        // Cria uma referência para o arquivo no Firebase Storage
        const timestamp = new Date().getTime();
        const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const storagePath = `images/${filename}`;
        
        console.log("Caminho no storage:", storagePath);
        const storageRef = ref(storage, storagePath);
        
        // Faz o upload do arquivo
        console.log("Iniciando upload para Firebase Storage...");
        const uploadResult = await uploadBytes(storageRef, file);
        console.log('Upload realizado com sucesso:', uploadResult.ref.fullPath);
        
        // Obtém a URL pública do arquivo
        console.log("Obtendo URL de download...");
        const downloadURL = await getDownloadURL(uploadResult.ref);
        
        console.log('URL da imagem:', downloadURL);
        return downloadURL;
      } catch (error) {
        console.error('Erro no upload para Firebase:', error);
        alert('Erro ao fazer upload da imagem: ' + error.message);
        return null;
      }
    } else {
      console.error('Firebase Storage não está disponível');
      alert('Firebase Storage não está disponível');
      // Fallback para URL local temporária
      return URL.createObjectURL(file);
    }
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    alert('Erro ao fazer upload da imagem: ' + error.message);
    return null;
  }
}; 