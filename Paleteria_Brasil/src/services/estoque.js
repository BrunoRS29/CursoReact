const baseUrl = 'http://localhost:8080/estoque';

// Mapeia apenas os campos que o EstoqueCreateDTO espera:
function mapToPayloadEstoque(item) {
  return {
    quantProduto: parseInt(item.quantProduto, 10),
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
  const payload = {
    quantProduto: parseInt(item.quantProduto, 10),
    dataEnt: item.dataEnt,
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

export async function listarSubtiposPorTipo(tipo) {
  const url = `http://localhost:8080/produto/listar/BuscarSubtipo/${encodeURIComponent(tipo)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao listar subtipos por tipo');
  return await res.json();
}

export async function listarProdutosPorTipoESubtipo(tipo, subtipo) {
  if (!subtipo || subtipo.trim() === '') {
    console.warn('Subtipo inválido para busca:', subtipo);
    return [];
  }

  const url = `http://localhost:8080/produto/listar/ListarProduto/${encodeURIComponent(subtipo)}`;
  console.log("Buscando:", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error('Erro ao listar produtos por subtipo');
  return await res.json();
}