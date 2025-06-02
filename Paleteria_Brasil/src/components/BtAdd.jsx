import React, { useState, useEffect } from 'react';
import { 
  inserirEstoque, 
  listarProdutosPorTipoESubtipo, 
  listarSubtiposPorTipo 
} from '../services/estoque';
import styles from '../styles/estoquebt.module.css';

const BtAdd = ({ onInserido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [subtiposDisponiveis, setSubtiposDisponiveis] = useState([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [subtipoSelecionado, setSubtipoSelecionado] = useState('');

  const [novoItem, setNovoItem] = useState({
    quantProduto: '',
    validadeProd: '',
    statusProd: '',
    produto: { id: '' }
  });

  // Buscar subtipos dinamicamente ao selecionar a categoria
  useEffect(() => {
    async function buscarSubtipos() {
      if (!categoriaSelecionada) {
        setSubtiposDisponiveis([]);
        setSubtipoSelecionado('');
        return;
      }
      try {
        const data = await listarSubtiposPorTipo(categoriaSelecionada);

        // Remove duplicados:
        const subtiposUnicos = Array.from(
          new Set(data.map(sub => sub.subtipoProduto))
        ).map(subtipo => ({ subtipoProduto: subtipo }));

        setSubtiposDisponiveis(subtiposUnicos);
        setSubtipoSelecionado('');
      } catch (err) {
        console.error('Erro ao carregar subtipos:', err);
      }
  }

  buscarSubtipos();
}, [categoriaSelecionada]);

  // Buscar produtos ao mudar categoria ou subtipo
  useEffect(() => {
    async function buscarProdutos() {
      if (!categoriaSelecionada) {
        setProdutosFiltrados([]);
        setNovoItem(prev => ({ ...prev, produto: { id: '' } }));
        return;
      }
      try {
        const data = await listarProdutosPorTipoESubtipo(categoriaSelecionada, subtipoSelecionado);
        console.log('Produtos retornados:', data);
        setProdutosFiltrados(data);
        setNovoItem(prev => ({ ...prev, produto: { id: '' } }));
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      }
    }

    buscarProdutos();
  }, [categoriaSelecionada, subtipoSelecionado]);

  const abrirModal = () => {
    setCategoriaSelecionada('');
    setSubtipoSelecionado('');
    setProdutosFiltrados([]);
    setSubtiposDisponiveis([]);
    setNovoItem({
      quantProduto: '',
      validadeProd: '',
      statusProd: '',
      produto: { id: '' }
    });
    setMostrarModal(true);
  };

  const fecharModal = () => setMostrarModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'produto.id') {
      setNovoItem(prev => ({ ...prev, produto: { ...prev.produto, id: Number(value) } }));
    } else {
      setNovoItem(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInsert = async () => {
    try {
      await inserirEstoque(novoItem);
      if (typeof onInserido === 'function') {
        onInserido();
      }
      fecharModal();
    } catch (err) {
      console.error('Erro ao inserir estoque:', err);
      alert('Falha ao inserir. Veja o console para detalhes.');
    }
  };

  return (
    <>
      <button className={styles.btnTabela} onClick={abrirModal}>
        Adicionar ao Estoque
      </button>

      {mostrarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Adicionar ao Estoque</h3>

            <input
              name="quantProduto"
              type="number"
              placeholder="Quantidade"
              value={novoItem.quantProduto}
              onChange={handleChange}
            />

            <input
              name="validadeProd"
              type="date"
              placeholder="Validade (ex: 2025-07-15)"
              value={novoItem.validadeProd}
              onChange={handleChange}
            />

            <input
              name="statusProd"
              type="text"
              placeholder="Status (ex: DISPONÍVEL)"
              value={novoItem.statusProd}
              onChange={handleChange}
            />

            {/* Select de categoria */}
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              <option value="paleta">Paleta</option>
              <option value="pote">Pote</option>
              <option value="matéria-prima">Matéria-prima</option>
            </select>

            {/* Select de subtipo dinâmico */}
            <select
              value={subtipoSelecionado}
              onChange={(e) => setSubtipoSelecionado(e.target.value)}
              disabled={!categoriaSelecionada || subtiposDisponiveis.length === 0}
            >
              <option value="">Selecione um subtipo</option>
              {subtiposDisponiveis.map((sub, index) => (
                <option key={index} value={sub.subtipoProduto}>
                  {sub.subtipoProduto}
                </option>
              ))}
            </select>

            {/* Select de produto */}
            <select
              name="produto.id"
              value={novoItem.produto.id}
              onChange={handleChange}
              disabled={!categoriaSelecionada}
            >
              <option value="">Selecione o produto</option>
              {produtosFiltrados.map(prod => (
                <option key={prod.id} value={prod.id}>
                  {prod.nomeProd}
                </option>
              ))}
              {produtosFiltrados.length === 0 && categoriaSelecionada && (
                <option disabled>Nenhum produto encontrado</option>
              )}
            </select>

            <div className={styles.modalButtons}>
              <button onClick={handleInsert}>Inserir</button>
              <button onClick={fecharModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BtAdd;
