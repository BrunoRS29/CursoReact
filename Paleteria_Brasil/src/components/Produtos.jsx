import { useEffect, useState } from 'react';
import {
  listarProdutos,
  inserirProduto,
  alterarProduto,
  removerProduto
} from '../services/produto';
import styles from '../styles/Produtos.module.css';

export default function Produtos() {
  const FIXO_FORNECEDOR_ID = '1';
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    id_produto: '',
    nome_prod: '',
    tipo_produto: '',
    subtipo_produto: '',
    valor_prod: '',
    fk_fornecedor_id_fornecedor: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoSelecionado, setTipoSelecionado] = useState('Paleta');

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await listarProdutos();
      const produtosMapeados = data.map(p => ({
        id_produto: p.id,
        nome_prod: p.nomeProd,
        tipo_produto: p.tipoProduto,
        subtipo_produto: p.subtipoProduto,
        valor_prod: p.valorProd,
        fk_fornecedor_id_fornecedor: p.fornecedor?.id?.toString() ?? ''
      }));
      setProdutos(produtosMapeados);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'tipo_produto') {
      if (value === 'Paleta' || value === 'Pote') {
        setForm(prev => ({
          ...prev,
          tipo_produto: value,
          subtipo_produto: '',
          fk_fornecedor_id_fornecedor: FIXO_FORNECEDOR_ID, // fixa o fornecedor
        }));
      } else {
        // Matéria-prima permite editar fornecedor e subtipo manualmente
        setForm(prev => ({
          ...prev,
          tipo_produto: value,
          subtipo_produto: '',
          fk_fornecedor_id_fornecedor: '',
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const limparFormulario = () => {
    setForm({
      id_produto: '',
      nome_prod: '',
      tipo_produto: '',
      subtipo_produto: '',
      valor_prod: '',
      fk_fornecedor_id_fornecedor: ''
    });
    setModoEdicao(false);
  };

  const abrirModal = (produto = null) => {
    if (produto) {
      setForm(produto);
      setModoEdicao(true);
    } else {
      limparFormulario();
    }
    setMostrarModal(true);
  };

  const fecharModal = () => {
    setMostrarModal(false);
    limparFormulario();
  };

  const handleAdd = async () => {
    await inserirProduto(form);
    await carregarProdutos();
    fecharModal();
  };

  const handleUpdate = async () => {
    await alterarProduto(form.id_produto, form);
    await carregarProdutos();
    fecharModal();
  };

  const handleDelete = async () => {
    await removerProduto(form.id_produto);
    await carregarProdutos();
    fecharModal();
  };

  const produtosFiltrados = produtos.filter(p => p.tipo_produto === tipoSelecionado);

  return (
    <div className={styles.produtos}>
      <div className={styles.topo}>
        <button className={styles.botao} onClick={() => abrirModal()}>
          Registrar Produto
        </button>
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
            <th>Nome</th>
            <th>Subtipo</th>
            {tipoSelecionado !== 'Matéria-prima' ? (
              <th>Valor</th>
            ) : (
              <>
                <th>Valor</th>
                <th>Fornecedor</th>
              </>
            )}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtosFiltrados.map((p) => (
            <tr key={p.id_produto}>
              <td>{p.nome_prod}</td>
              <td>{p.subtipo_produto}</td>

              {tipoSelecionado !== 'Matéria-prima' ? (
                <td>{p.valor_prod}</td>
              ) : (
                <>
                  <td>{p.valor_prod}</td>
                  <td>{p.fk_fornecedor_id_fornecedor}</td>
                </>
              )}

              <td>
                <button className={styles.btnTabela} onClick={() => abrirModal(p)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>
              {modoEdicao ? 'Editar Produto' : 'Registrar Produto'}
            </h3>

            {/* Select para Tipo */}
            <select
              name="tipo_produto"
              value={form.tipo_produto}
              onChange={handleChange}
            >
              <option value="">Tipo</option>
              <option value="Paleta">Paleta</option>
              <option value="Pote">Pote</option>
              <option value="Matéria-prima">Matéria-prima</option>
            </select>

            {/* Nome */}
            <input
              name="nome_prod"
              placeholder="Nome"
              value={form.nome_prod}
              onChange={handleChange}
            />

            {/* Subtipo condicional */}
            {form.tipo_produto === 'Paleta' && (
              <select
                name="subtipo_produto"
                value={form.subtipo_produto}
                onChange={handleChange}
              >
                <option value="">Selecione o subtipo</option>
                <option value="Recheada">Recheada</option>
                <option value="Cremosa">Cremosa</option>
                <option value="Fruta">Fruta</option>
                <option value="Zero">Zero</option>
              </select>
            )}

            {form.tipo_produto === 'Pote' && (
              <select
                name="subtipo_produto"
                value={form.subtipo_produto}
                onChange={handleChange}
              >
                <option value="">Selecione o subtipo</option>
                <option value="300ml">300ml</option>
                <option value="1L">1L</option>
                <option value="2L">2L</option>
              </select>
            )}

            {form.tipo_produto === 'Matéria-prima' && (
              <input
                name="subtipo_produto"
                placeholder="Subtipo"
                value={form.subtipo_produto}
                onChange={handleChange}
              />
            )}

            {/* Valor */}
            <input
              name="valor_prod"
              placeholder="Valor"
              type="number"
              value={form.valor_prod}
              onChange={handleChange}
            />

            {/* Fornecedor só para Matéria-prima */}
            {form.tipo_produto === 'Matéria-prima' && (
              <input
                name="fk_fornecedor_id_fornecedor"
                placeholder="ID Fornecedor"
                value={form.fk_fornecedor_id_fornecedor}
                onChange={handleChange}
              />
            )}

            <div className={styles.modalButtons}>
              {modoEdicao ? (
                <>
                  <button
                    className={styles.botao2}
                    onClick={handleUpdate}
                  >
                    Atualizar
                  </button>
                  <button
                    className={styles.botao2}
                    onClick={handleDelete}
                  >
                    Remover
                  </button>
                </>
              ) : (
                <button
                  className={styles.botao2}
                  onClick={handleAdd}
                >
                  Salvar
                </button>
              )}
              <button
                className={styles.botao2}
                onClick={fecharModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
