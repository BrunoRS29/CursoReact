import React, { useEffect, useState } from 'react';
import { listarEstoque } from '../services/estoque';
import styles from '../styles/estoquebt.module.css';

const Validade = () => {
  const [produtosProximos, setProdutosProximos] = useState([]);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);

  useEffect(() => {
    const verificarValidades = async () => {
      try {
        const estoque = await listarEstoque();
        const hoje = new Date();

        const proximos = estoque.filter(item => {
            const validade = new Date(item.validadeProd + 'T00:00:00');
            const diff = (validade - hoje) / (1000 * 60 * 60 * 24); // dias
            return diff >= 0 && diff <= 14 && item.statusProd !== 'Indisponivel';
        });


        if (proximos.length > 0) {
          setProdutosProximos(proximos);
          setMostrarAlerta(true);
        }
      } catch (err) {
        console.error('Erro ao verificar validades:', err);
      }
    };

    verificarValidades();
  }, []);

  const fecharAlerta = () => setMostrarAlerta(false);

  return (
    <>
      {mostrarAlerta && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3 style={{ color: 'darkgreen' }}>Atenção: Produtos Próximos da Validade</h3>
            <ul>
              {produtosProximos.map((item, index) => {
                const validadeFormatada = new Date(item.validadeProd + 'T00:00:00')
                  .toLocaleDateString('pt-BR');
                return (
                  <li key={index}>
                    <strong>{item.produto?.nomeProd || 'Produto sem nome'}</strong> - Vence em: {validadeFormatada}
                  </li>
                );
              })}
            </ul>
            <button onClick={fecharAlerta}>Fechar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Validade;
