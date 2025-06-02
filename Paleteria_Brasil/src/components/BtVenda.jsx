import React, { useState, useEffect } from 'react';
import { listarEstoque } from '../services/estoque';
import { enviarVenda } from '../services/vendas';
import styles from '../styles/vendabt.module.css';

const BtVenda = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [estoque, setEstoque] = useState([]);

  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [subtipoSelecionado, setSubtipoSelecionado] = useState('');
  const [subtiposDisponiveis, setSubtiposDisponiveis] = useState([]);

  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');

  const [quantidade, setQuantidade] = useState(1);
  const [itensVenda, setItensVenda] = useState([]);

  const [formaPagamento, setFormaPagamento] = useState('');

  useEffect(() => {
    async function fetchEstoque() {
      try {
        const data = await listarEstoque();
        setEstoque(data);
      } catch (err) {
        console.error('Erro ao carregar estoque:', err);
      }
    }
    fetchEstoque();
  }, []);

  useEffect(() => {
    if (tipoSelecionado && estoque.length > 0) {
      const subtipos = estoque
        .filter(
          (item) =>
            item.produto &&
            item.produto.tipoProduto?.toLowerCase() === tipoSelecionado.toLowerCase()
        )
        .map((item) => item.produto.subtipoProduto)
        .filter((valor, idx, self) => valor && self.indexOf(valor) === idx);

      setSubtiposDisponiveis(subtipos);
    } else {
      setSubtiposDisponiveis([]);
    }

    setSubtipoSelecionado('');
    setProdutosFiltrados([]);
    setProdutoSelecionado('');
  }, [tipoSelecionado, estoque]);

  useEffect(() => {
    if (tipoSelecionado && subtipoSelecionado && estoque.length > 0) {
      const filtrados = estoque.filter(
        (item) =>
          item.produto &&
          item.produto.tipoProduto?.toLowerCase() === tipoSelecionado.toLowerCase() &&
          item.produto.subtipoProduto?.toLowerCase() === subtipoSelecionado.toLowerCase()
      );
      setProdutosFiltrados(filtrados);
    } else {
      setProdutosFiltrados([]);
    }
    setProdutoSelecionado('');
  }, [tipoSelecionado, subtipoSelecionado, estoque]);

  const abrirModal = () => {
    setMostrarModal(true);
    setTipoSelecionado('');
    setSubtipoSelecionado('');
    setProdutoSelecionado('');
    setQuantidade(1);
    setItensVenda([]);
    setFormaPagamento('');
  };

  const fecharModal = () => {
    setMostrarModal(false);
  };

  const adicionarItem = () => {
    if (!produtoSelecionado) return;

    const produtoObj = produtosFiltrados.find(
      (item) => item.id === parseInt(produtoSelecionado, 10)
    );
    if (!produtoObj) return;

    const itemExistente = itensVenda.find((i) => i.id === produtoObj.id);
    const quantidadeExistente = itemExistente ? itemExistente.quantidade : 0;
    const quantidadeTotal = quantidadeExistente + quantidade;

    if (quantidadeTotal > produtoObj.quantProduto) {
      alert(`Quantidade insuficiente no estoque. Disponível: ${produtoObj.quantProduto}`);
      return;
    }

    if (itemExistente) {
      const novaLista = itensVenda.map((i) =>
        i.id === produtoObj.id
          ? { ...i, quantidade: i.quantidade + quantidade }
          : i
      );
      setItensVenda(novaLista);
    } else {
      setItensVenda([
        ...itensVenda,
        {
          id: produtoObj.id,
          nome: produtoObj.produto.nomeProd,
          subtipo: produtoObj.produto.subtipoProduto,
          tipo: produtoObj.produto.tipoProduto,
          quantidade: quantidade,
          valor: produtoObj.produto.valorProd,
        },
      ]);
    }

    setProdutoSelecionado('');
    setQuantidade(1);
  };

  const subtotal = itensVenda.reduce(
    (total, item) => total + item.quantidade * item.valor,
    0
  );

  const finalizarVenda = async () => {
    if (itensVenda.length === 0) {
      alert('Adicione ao menos um item para finalizar a venda.');
      return;
    }
    if (!formaPagamento) {
      alert('Selecione uma forma de pagamento.');
      return;
    }

    const vendaDTO = {
      idsEstoque: itensVenda.map((item) => item.id),
      quantidades: itensVenda.map((item) => item.quantidade),
      formaPagamento,
    };

    try {
      await enviarVenda(vendaDTO);
      alert('Venda realizada com sucesso!');
      fecharModal();
    } catch (error) {
      alert('Falha ao finalizar venda: ' + error.message);
      console.error(error);
    }
  };

  return (
    <>
      <button className={styles.btnTabela} onClick={abrirModal}>
        Nova Venda
      </button>

      {mostrarModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Nova Venda</h3>

            {/* FORMULÁRIO À ESQUERDA */}
            <div className={styles.formSection}>
              <label htmlFor="select-tipo">Tipo:</label>
              <select
                id="select-tipo"
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
              >
                <option value="">Selecione o tipo</option>
                <option value="paleta">Paleta</option>
                <option value="pote">Pote</option>
              </select>

              {tipoSelecionado && (
                <>
                  <label htmlFor="select-subtipo">Subtipo:</label>
                  <select
                    id="select-subtipo"
                    value={subtipoSelecionado}
                    onChange={(e) => setSubtipoSelecionado(e.target.value)}
                  >
                    <option value="">Selecione o subtipo</option>
                    {subtiposDisponiveis.length > 0 ? (
                      subtiposDisponiveis.map((subtipo, idx) => (
                        <option key={idx} value={subtipo}>
                          {subtipo.charAt(0).toUpperCase() + subtipo.slice(1)}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Nenhum subtipo encontrado
                      </option>
                    )}
                  </select>
                </>
              )}

              {tipoSelecionado && subtipoSelecionado && (
                <>
                  <label htmlFor="select-produto">Produto:</label>
                  <select
                    id="select-produto"
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                  >
                    <option value="">Selecione o produto</option>
                    {produtosFiltrados.length > 0 ? (
                      produtosFiltrados.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.produto.nomeProd} – R$ {prod.produto.valorProd.toFixed(2)} (
                          {prod.quantProduto} disponíveis)
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Nenhum produto encontrado
                      </option>
                    )}
                  </select>
                </>
              )}

              <label htmlFor="input-quantidade">Quantidade:</label>
              <input
                id="input-quantidade"
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (e.target.value === '' || isNaN(v) || v < 1) {
                    setQuantidade(1);
                  } else {
                    setQuantidade(v);
                  }
                }}
                disabled={!produtoSelecionado}
              />

              <button
                className={styles.btnAdicionar}
                onClick={adicionarItem}
                disabled={!produtoSelecionado}
              >
                Adicionar
              </button>

              <label htmlFor="select-forma-pagamento" style={{ marginTop: '1rem' }}>
                Forma de pagamento:
              </label>
              <select
                id="select-forma-pagamento"
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value)}
              >
                <option value="">Selecione a forma de pagamento</option>
                <option value="debito">Débito</option>
                <option value="credito">Crédito</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="pix">Pix</option>
              </select>
            </div>

            {/* TABELA À DIREITA */}
            <div className={styles.tableSection}>
              {itensVenda.length > 0 ? (
                <table className={styles.tabelaItens}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Subtipo</th>
                      <th>Tipo</th>
                      <th>Quantidade</th>
                      <th>Unitário</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itensVenda.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nome}</td>
                        <td>{item.subtipo}</td>
                        <td>{item.tipo}</td>
                        <td>{item.quantidade}</td>
                        <td>R$ {item.valor.toFixed(2)}</td>
                        <td>R$ {(item.quantidade * item.valor).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className={styles.nenhumItem}>Nenhum item adicionado</div>
              )}

              <p className={styles.subtotal}>
                <strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}
              </p>

              <div className={styles.modalButtons}>
                <button className={styles.btnCancelar} onClick={fecharModal}>
                  Cancelar
                </button>
                <button className={styles.btnFinalizar} onClick={finalizarVenda}>
                  Finalizar Venda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BtVenda;
