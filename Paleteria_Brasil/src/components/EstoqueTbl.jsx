import { useEffect, useState } from 'react';
import {
  listarEstoque,
  alterarEstoque,
  removerEstoque
} from '../services/estoque';
import styles from '../styles/estoque.module.css';

export default function EstoqueTbl() {
    const emptyItem = {
    id: null,
    quantProduto: '',
    dataEnt: '',
    validadeProd: '',
    statusProd: '',
    produto: { id: '', nomeProd: '', tipoProduto: '', subtipoProduto: '' }
  };


  const [estoque, setEstoque] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState(emptyItem);
  const [tipoSelecionado, setTipoSelecionado] = useState('Paleta');

  useEffect(() => {
    (async () => {
      try {
        await carregarEstoque();
      } catch (err) {
        console.error('Erro geral ao iniciar estoque:', err);
      }
    })();
  }, []);

  const carregarEstoque = async () => {
    const data = await listarEstoque();
    setEstoque(data);
  };

  const abrirModal = (item) => {
    setItemSelecionado(item);
    setModoEdicao(true);
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setItemSelecionado(emptyItem);
    setMostrarModal(false);
    setModoEdicao(false);
  };

  const handleUpdate = async () => {
    try {
      await alterarEstoque(itemSelecionado.id, itemSelecionado);
      await carregarEstoque();
      fecharModal();
    } catch (e) {
      console.error('Erro ao atualizar:', e);
    }
  };

  const handleDelete = async () => {
    try {
      await removerEstoque(itemSelecionado.id);
      await carregarEstoque();
      fecharModal();
    } catch (e) {
      console.error('Erro ao remover:', e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemSelecionado(prev => ({ ...prev, [name]: value }));
  };

  const estoqueFiltrado = estoque.filter(e =>
    e.produto &&
    e.produto.tipoProduto === tipoSelecionado &&
    e.statusProd !== 'Indisponivel'
  );

  return (
    <div className={styles.estoque}>
      <div className={styles.topo}>
        <select
          value={tipoSelecionado}
          onChange={(e) => setTipoSelecionado(e.target.value)}
        >
          <option value="Paleta">Paleta</option>
          <option value="Pote">Pote</option>
          <option value="Matéria-prima">Matéria-prima</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Subtipo</th>
            <th>Quantidade</th>
            <th>Data Entrada</th>
            <th>Validade</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estoqueFiltrado.map((item) => (
            <tr key={item.id}>
              <td>{item.produto.nomeProd}</td>
              <td>{item.produto.subtipoProduto}</td>
              <td>{item.quantProduto}</td>
              <td>{item.dataEnt}</td>
              <td>{new Date(item.validadeProd + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
              <td>{item.statusProd}</td>
              <td>
                <button
                  className={styles.btnTabela}
                  onClick={() => abrirModal(item)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(mostrarModal && itemSelecionado.id != null) && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>{modoEdicao ? 'Editar Estoque' : 'Novo Estoque'}</h3>
            <input
              name="quantProduto"
              type="number"
              value={itemSelecionado.quantProduto}
              onChange={handleChange}
            />
            <input
              name="dataEnt"
              type="text"
              value={itemSelecionado.dataEnt}
              onChange={handleChange}
            />
            <input
              name="validadeProd"
              type="text"
              value={itemSelecionado.validadeProd}
              onChange={handleChange}
            />
            <input
              name="statusProd"
              type="text"
              value={itemSelecionado.statusProd}
              onChange={handleChange}
            />
            <div className={styles.modalButtons}>
              <button onClick={handleUpdate}>Atualizar</button>
              <button onClick={handleDelete}>Remover</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
