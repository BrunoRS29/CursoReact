const BASE_URL = 'http://localhost:8080/transacao';

export async function listarVendasDoDia() {
  try {
    const response = await fetch(`${BASE_URL}/vendasDoDia`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar vendas do dia: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('listarVendasDoDia (fetch) →', error);
    throw error;
  }
}

export async function enviarVenda(vendaDTO) {
  try {
    const response = await fetch(`${BASE_URL}/inserir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendaDTO),
    });

    if (!response.ok) {
      // Se houver algum texto de erro vindo no corpo, você pode ler:
      const textoErro = await response.text();
      throw new Error(`Erro ao enviar venda: ${textoErro || response.statusText}`);
    }

    // Não tentamos ler response.json(), porque sua API não retorna JSON no corpo.
    return; 
  } catch (error) {
    console.error('enviarVenda (fetch) →', error);
    throw error;
  }
}
