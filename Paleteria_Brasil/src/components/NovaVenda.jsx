import { useEffect, useState } from 'react';
import { listarVendasDoDia } from '../services/vendas';
import styles from '../styles/vendasDia.module.css';

export default function NovaVenda() {
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await listarVendasDoDia();
        setVendas(data);
      } catch (err) {
        console.error('Erro ao carregar vendas do dia:', err);
      }
    })();
  }, []);

  return (
    <div className={styles.vendas}>
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
