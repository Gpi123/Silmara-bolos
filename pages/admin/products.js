import Link from 'next/link';

// Adicionar link para a página de configuração de regras na parte superior, próximo ao botão "Adicionar Produto"
<div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold">Produtos</h1>
  <div className="flex gap-2">
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