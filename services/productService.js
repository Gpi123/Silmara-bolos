import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app, db, storage } from '../firebase/config';

const COLLECTION_NAME = 'products';
const LOCAL_STORAGE_KEY = 'localProducts';

// Função para gerar ID único (usada como fallback)
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
    console.log("Buscando produtos do Firestore...");
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log(`${products.length} produtos encontrados no Firestore`);
    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos do Firestore:', error);
    
    // Fallback para localStorage em caso de erro
    console.log("Usando localStorage como fallback");
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    return products;
  }
};

// Obter um produto pelo ID
export const getProductById = async (id) => {
  try {
    console.log(`Buscando produto ${id} do Firestore`);
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Produto não encontrado');
    }
  } catch (error) {
    console.error('Erro ao buscar produto do Firestore:', error);
    
    // Fallback para localStorage em caso de erro
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const product = products.find(p => p.id === id);
    
    if (product) {
      return product;
    } else {
      throw new Error('Produto não encontrado');
    }
  }
};

// Adicionar um novo produto
export const addProduct = async (productData, imageFile) => {
  try {
    let imageURL = productData.imageURL || '';
    
    // Se houver uma imagem, fazer upload para o Storage
    if (imageFile) {
      imageURL = await uploadImage(imageFile);
    }
    
    // Dados a serem salvos no Firestore
    const dataToSave = {
      ...productData,
      imageURL,
      createdAt: serverTimestamp()
    };
    
    console.log("Salvando produto no Firestore:", dataToSave);
    const docRef = await addDoc(collection(db, COLLECTION_NAME), dataToSave);
    
    return { id: docRef.id, ...dataToSave };
  } catch (error) {
    console.error('Erro ao adicionar produto no Firestore:', error);
    
    // Fallback para localStorage em caso de erro
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const newProduct = {
      id: generateId(),
      ...productData,
      imageURL: productData.imageURL || '',
      createdAt: new Date()
    };
    
    products.push(newProduct);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    
    return newProduct;
  }
};

// Atualizar um produto existente
export const updateProduct = async (id, productData, imageFile) => {
  try {
    let imageURL = productData.imageURL || '';
    
    // Se houver uma nova imagem, fazer upload e atualizar a URL
    if (imageFile) {
      imageURL = await uploadImage(imageFile);
    }
    
    // Dados a serem atualizados no Firestore
    const dataToUpdate = {
      ...productData,
      imageURL,
      updatedAt: serverTimestamp()
    };
    
    console.log(`Atualizando produto ${id} no Firestore`);
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, dataToUpdate);
    
    return { id, ...dataToUpdate };
  } catch (error) {
    console.error('Erro ao atualizar produto no Firestore:', error);
    
    // Fallback para localStorage em caso de erro
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      throw new Error('Produto não encontrado');
    }
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      imageURL: productData.imageURL || products[index].imageURL || '',
      updatedAt: new Date()
    };
    
    products[index] = updatedProduct;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    
    return updatedProduct;
  }
};

// Deletar um produto
export const deleteProduct = async (id) => {
  try {
    console.log(`Excluindo produto ${id} do Firestore`);
    
    // Obter produto para pegar a URL da imagem, se existir
    const productRef = doc(db, COLLECTION_NAME, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      throw new Error('Produto não encontrado');
    }
    
    // Se houver uma imagem, tentar deletá-la do Storage
    if (productSnap.data().imageURL) {
      try {
        const imageRef = ref(storage, productSnap.data().imageURL);
        await deleteObject(imageRef);
        console.log("Imagem deletada com sucesso do Storage");
      } catch (imageError) {
        console.log('Aviso: Imagem não encontrada no storage ou outro erro:', imageError);
      }
    }
    
    // Deletar o produto do Firestore
    await deleteDoc(productRef);
    
    return id;
  } catch (error) {
    console.error('Erro ao deletar produto do Firestore:', error);
    
    // Fallback para localStorage em caso de erro
    const products = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error('Produto não encontrado');
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredProducts));
    
    return id;
  }
};

// Função para upload de imagens
export const uploadImage = async (file) => {
  try {
    if (!file) {
      console.log("Nenhum arquivo fornecido para upload");
      return null;
    }
    
    console.log("Iniciando upload da imagem:", file.name, "Tamanho:", Math.round(file.size/1024), "KB");
    
    if (storage) {
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
    } else {
      console.error('Firebase Storage não está disponível');
      throw new Error('Firebase Storage não está disponível');
    }
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
}; 