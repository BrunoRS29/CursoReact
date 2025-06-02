import { useEffect, useState } from 'react';
import { listarVendasPorData } from '../services/vendas'; // Novo serviço que recebe a data
import styles from '../styles/vendasDia.module.css';

export default function VendasFiltradas() {
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date().toISOString().split('T')[0]; // formato yyyy-mm-dd
    return hoje;
  });
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    const carregarVendas = async () => {
      try {
        const data = await listarVendasPorData(dataSelecionada);
        setVendas(data);
      } catch (err) {
        console.error('Erro ao carregar vendas:', err);
      }
    };
    carregarVendas();
  }, [dataSelecionada]);

  return (
    <div className={styles.vendas}>
      <div>
        <label>Filtrar por data: </label>
        <input
          type="date"
          value={dataSelecionada}
          onChange={(e) => setDataSelecionada(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor Total (R$)</th>
            <th>Forma Pagamento</th>
            <th>Data</th>
            <th>Hora</th>
          </tr>
        </thead>
        <tbody>
          {vendas.map((transacao) => (
            <tr key={`${transacao.id}-${transacao.idEstoque}`}>
              <td>{transacao.id}</td>
              <td>{transacao.nomeProd}</td>
              <td>{transacao.quantProduto}</td>
              <td>{transacao.valorTotal.toFixed(2)}</td>
              <td>{transacao.formaPagamento}</td>
              <td>{transacao.data}</td>
              <td>{transacao.hora}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
