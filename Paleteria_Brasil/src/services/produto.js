const baseUrl = 'http://localhost:8080/produto';

// Função auxiliar para mapear o form para o payload esperado pela API
function mapToPayload(produto) {
  return {
    nomeProd: produto.nome_prod,
    tipoProduto: produto.tipo_produto,
    subtipoProduto: produto.subtipo_produto,
    valorProd: parseFloat(produto.valor_prod),
    fornecedor: {
      id: parseInt(produto.fk_fornecedor_id_fornecedor, 10)
    }
  };
}

// CRUD para produtos (única rota)
export async function listarProdutos() {
  const res = await fetch(`${baseUrl}/listar`);
  if (!res.ok) throw new Error('Erro ao listar produtos');
  return await res.json();
}

export async function inserirProduto(produto) {
  // Converte o form para o formato que a API espera
  const payload = mapToPayload(produto);
  const res = await fetch(`${baseUrl}/inserir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao inserir produto');
}

export async function alterarProduto(id, produto) {
  // Converte o form para o formato que a API espera
  const payload = mapToPayload(produto);
  const res = await fetch(`${baseUrl}/alterar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao alterar produto');
}

export async function removerProduto(id) {
  const res = await fetch(`${baseUrl}/remover/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao remover produto');
}
