import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function ConfigurarRegras() {
  return (
    <Layout>
      <Head>
        <title>Configurar Regras do Firestore - Silmara Bolos</title>
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Configurar Regras de Segurança</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Problema de Permissões no Firestore</h2>
          
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            <p className="font-medium">Erro detectado: <span className="font-mono">FirebaseError: Missing or insufficient permissions</span></p>
          </div>
          
          <p className="mb-4">
            Para que seu site funcione corretamente em todos os dispositivos, é necessário configurar as regras
            de segurança do Firestore para permitir leitura e escrita dos dados. Siga os passos abaixo:
          </p>
          
          <ol className="list-decimal pl-5 space-y-4 mb-6">
            <li>
              <p className="font-medium">Acesse o console do Firebase</p>
              <p className="text-gray-600">Vá para <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">console.firebase.google.com</a> e selecione seu projeto.</p>
            </li>
            
            <li>
              <p className="font-medium">Acesse o Firestore Database</p>
              <p className="text-gray-600">No menu lateral, clique em "Firestore Database".</p>
            </li>
            
            <li>
              <p className="font-medium">Acesse as regras</p>
              <p className="text-gray-600">Clique na aba "Regras" no topo da página.</p>
            </li>
            
            <li>
              <p className="font-medium">Substitua as regras existentes pelas seguintes:</p>
              <div className="bg-gray-800 rounded-md p-4 my-3">
                <pre className="text-green-400 whitespace-pre-wrap text-sm">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                </pre>
              </div>
              <p className="text-yellow-600 text-sm mt-2">
                <strong>Observação de segurança:</strong> Estas regras permitem que qualquer pessoa leia e escreva dados. 
                Em um ambiente de produção real, você deve considerar regras mais restritivas,
                mas para testes e desenvolvimento inicial, estas são adequadas.
              </p>
            </li>
            
            <li>
              <p className="font-medium">Publique as regras</p>
              <p className="text-gray-600">Clique no botão "Publicar" para salvar as alterações.</p>
            </li>
          </ol>
          
          <h3 className="text-lg font-semibold mt-8 mb-3">Verificando se funciona</h3>
          <p className="mb-6">
            Após configurar as regras, volte para a página de produtos e tente adicionar ou editar um produto.
            Se as alterações aparecerem em todos os dispositivos, significa que as regras foram configuradas corretamente.
          </p>
        </div>
        
        <div className="flex justify-between">
          <Link href="/admin/products">
            <a className="btn btn-outline">Voltar para Produtos</a>
          </Link>
        </div>
      </div>
    </Layout>
  );
} 