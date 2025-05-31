const baseUrl = 'http://localhost:8080/estoque';

// Mapeia apenas os campos que o EstoqueCreateDTO espera:
//   • quantProduto
//   • validadeProd
//   • statusProd
//   • produtoId
function mapToPayloadEstoque(item) {
  return {
    quantProduto: parseInt(item.quantProduto, 10),
    // dataEnt NÃO deve aparecer aqui, pois o DTO não tem esse campo
    validadeProd: item.validadeProd,
    statusProd: item.statusProd,
    produtoId: parseInt(item.produto.id, 10)
  };
}

export async function listarEstoque() {
  const res = await fetch(`${baseUrl}/listar`);
  if (!res.ok) throw new Error('Erro ao listar estoque');
  return await res.json();
}

export async function inserirEstoque(item) {
  const payload = mapToPayloadEstoque(item);

  const res = await fetch(`${baseUrl}/inserir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const texto = await res.text();
    console.error('Resposta 500 do servidor ao inserirEstoque:', texto);
    throw new Error('Erro ao inserir estoque');
  }
}

export async function alterarEstoque(id, item) {
  // No PUT, você envia um objeto “Estoque” inteiro (não o DTO), 
  // então aqui pode incluir dataEnt se quiser manter a data original ou outro campo.
  // Mas se seu controller de PUT estiver esperando um Estoque entity completo,
  // você pode enviar dataEnt + validadeProd + statusProd + produto:{id} etc.
  // Aqui fica o exemplo para manter compatibilidade com a sua rota de PUT atual:
  const payload = {
    quantProduto: parseInt(item.quantProduto, 10),
    dataEnt: item.dataEnt,              // o campo que a entidade Estoque tem
    validadeProd: item.validadeProd,
    statusProd: item.statusProd,
    produto: { id: parseInt(item.produto.id, 10) }
  };

  const res = await fetch(`${baseUrl}/alterar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const texto = await res.text();
    console.error('Resposta 500 do servidor ao alterarEstoque:', texto);
    throw new Error('Erro ao alterar estoque');
  }
}

export async function removerEstoque(id) {
  const res = await fetch(`${baseUrl}/remover/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erro ao remover estoque');
}

export async function listarProdutosPorTipo(tipo) {
  const res = await fetch(`http://localhost:8080/produto/listar/${encodeURIComponent(tipo)}`);
  if (!res.ok) throw new Error('Erro ao listar produtos por tipo');
  return await res.json();
}
