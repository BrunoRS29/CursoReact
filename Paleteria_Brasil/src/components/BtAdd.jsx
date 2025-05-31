import React, { useState, useEffect } from 'react';
import { inserirEstoque, listarProdutosPorTipo } from '../services/estoque';
import styles from '../styles/estoquebt.module.css';

const BtAdd = ({ onInserido }) => {
  const [mostrarModal, setMostrarModal] = useState(false);

  // Usaremos só “produtosFiltrados”, que vem do back via listarProdutosPorTipo(tipo).
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  const [novoItem, setNovoItem] = useState({
    quantProduto: '',
    validadeProd: '',
    statusProd: '',
    produto: { id: '' }
  });

  /**
   * Toda vez que o usuário mudar "categoriaSelecionada", chamamos o backend:
   * listarProdutosPorTipo(categoriaSelecionada).
   * Se categoriaSelecionada === '', limpamos o array para não mostrar nada.
   */
  useEffect(() => {
    async function buscarProdutosDoTipo() {
      // Se não houver categoria selecionada, limpa a lista e sai
      if (!categoriaSelecionada) {
        setProdutosFiltrados([]);
        setNovoItem(prev => ({
          ...prev,
          produto: { id: '' }
        }));
        return;
      }

      try {
        // Passa explicitamente o tipo para o serviço
        const data = await listarProdutosPorTipo(categoriaSelecionada);
        console.log('Produtos retornados:', data);
        // data deve ser algo como: [{ id, nome, tipo }, ...]
        setProdutosFiltrados(data);

        // Zera a seleção de “produto” caso já houvesse algo marcado
        setNovoItem(prev => ({
          ...prev,
          produto: { id: '' }
        }));
      } catch (err) {
        console.error('Erro ao carregar produtos por tipo:', err);
      }
    }

    buscarProdutosDoTipo();
  }, [categoriaSelecionada]);

  const abrirModal = () => {
    setCategoriaSelecionada('');
    setProdutosFiltrados([]);
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

    // Se for o select de produto (name="produto.id"), atualiza só produto.id
    if (name === 'produto.id') {
      setNovoItem(prev => ({
        ...prev,
        produto: { ...prev.produto, id: Number(value) }
    }));
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
              type="text"
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

            {/* 1) Select de categoria (sempre habilitado) */}
            <select
              value={categoriaSelecionada}
              onChange={(e) => setCategoriaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma categoria</option>
              <option value="paleta">Paleta</option>
              <option value="pote">Pote</option>
              <option value="matéria-prima">Matéria-prima</option>
            </select>

            {/* 2) Select de produto: habilitado somente se categoriaSelecionada tiver valor */}
            <select
              name="produto.id"
              value={novoItem.produto.id}
              onChange={handleChange}
              disabled={!categoriaSelecionada}
            >
              <option value="">Selecione o produto</option>
              {produtosFiltrados.map(prod => (
                <option key={prod.id} vaue={prod.id}>
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
