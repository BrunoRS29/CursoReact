const baseUrl = 'http://localhost:8080/fornecedor';

export async function listarFornecedores() {
  const res = await fetch(`${baseUrl}/listar`);
  if (!res.ok) throw new Error('Erro ao listar fornecedores');
  return await res.json();
}

export async function inserirFornecedor(fornecedor) {
  await fetch(`${baseUrl}/inserir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fornecedor),
  });
}

export async function alterarFornecedor(id, fornecedor) {
  await fetch(`${baseUrl}/alterar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fornecedor),
  });
}

export async function removerFornecedor(id) {
  await fetch(`${baseUrl}/remover/${id}`, { method: 'DELETE' });
}
