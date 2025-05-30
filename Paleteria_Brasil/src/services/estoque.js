const baseUrl = 'http://localhost:8080/estoque';

// Função auxiliar para mapear o item de estoque para o payload esperado pela API
function mapToPayloadEstoque(item) {
  return {
    quantProduto: parseInt(item.quantProduto, 10),
    dataEnt: item.dataEnt,
    validadeProd: item.validadeProd,
    statusProd: item.statusProd,
    produto: {
      id: item.produto.id
    }
  };
}

// Lista todos os registros de estoque
export async function listarEstoque() {
  const res = await fetch(`${baseUrl}/listar`);
  if (!res.ok) throw new Error('Erro ao listar estoque');
  return await res.json();
}

// Insere um novo registro de estoque
export async function inserirEstoque(item) {
  const payload = mapToPayloadEstoque(item);
  const res = await fetch(`${baseUrl}/inserir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao inserir estoque');
}

// Altera um registro de estoque pelo ID
export async function alterarEstoque(id, item) {
  const payload = mapToPayloadEstoque(item);
  const res = await fetch(`${baseUrl}/alterar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erro ao alterar estoque');
}

// Remove um registro de estoque pelo ID
export async function removerEstoque(id) {
  const res = await fetch(`${baseUrl}/remover/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao remover estoque');
}
