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
