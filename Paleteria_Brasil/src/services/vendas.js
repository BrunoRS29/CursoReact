const BASE_URL = 'http://localhost:8080/transacao';
const BASE_URL2 = 'http://localhost:8080/estoque';

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
    const response = await fetch(`${BASE_URL2}/novaVenda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendaDTO),
    });

    if (!response.ok) {
      const textoErro = await response.text();
      throw new Error(`Erro ao enviar venda: ${textoErro || response.statusText}`);
    }

    return; // Nada a retornar, sucesso simples
  } catch (error) {
    console.error('enviarVenda (fetch) →', error);
    throw error;
  }
}

export async function listarVendasPorData(data) {
  try {
    const response = await fetch(`${BASE_URL}/listarPorData/${data}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar vendas por data: ${response.status} ${response.statusText}`);
    }
    const resultado = await response.json();
    return resultado;
  } catch (error) {
    console.error('listarVendasPorData (fetch) →', error);
    throw error;
  }
}
