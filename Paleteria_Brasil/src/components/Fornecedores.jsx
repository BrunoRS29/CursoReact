import { useEffect, useState } from 'react';
import {
  listarFornecedores,
  inserirFornecedor,
  alterarFornecedor,
  removerFornecedor
} from '../services/fornecedor.js';
import styles from '../styles/Fornecedor.module.css';

export default function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState({ id: '', cnpj: '', nome_fornecedor: '', telefone: '' });
  const [modoEdicao, setModoEdicao] = useState(false);

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const data = await listarFornecedores();
      setFornecedores(data);
    } catch (error) {
      console.error(error);
      setFornecedores([]);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const limparFormulario = () => setForm({ id: '', cnpj: '', nome_fornecedor: '', telefone: '' }) || setModoEdicao(false);

  const handleAdd = async () => {
    await inserirFornecedor(form);
    await carregarFornecedores();
    limparFormulario();
  };

  const handleUpdate = async () => {
    await alterarFornecedor(form.id, form);
    await carregarFornecedores();
    limparFormulario();
  };

  const handleDelete = async () => {
    await removerFornecedor(form.id);
    await carregarFornecedores();
    limparFormulario();
  };

  const selecionarFornecedor = (f) => {
    setForm(f);
    setModoEdicao(true);
  };

  return (
    <div className={styles.fornecedores}>
      <h2>Gerenciar Fornecedores</h2>

      <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange}/>
      <input name="nome_fornecedor" placeholder="Nome" value={form.nome_fornecedor} onChange={handleChange}/>
      <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange}/>

      {!modoEdicao ? (
        <button onClick={handleAdd}>Adicionar</button>
      ) : (
        <>
          <button onClick={handleUpdate}>Atualizar</button>
          <button onClick={handleDelete}>Remover</button>
          <button onClick={limparFormulario}>Cancelar</button>
        </>
      )}

      <table>
        <thead>
          <tr>
            <th>CNPJ</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {fornecedores.map((f) => (
            <tr key={f.cnpj}>
              <td>{f.cnpj}</td>
              <td>{f.nome_fornecedor}</td>
              <td>{f.telefone}</td>
              <td><button onClick={() => selecionarFornecedor(f)}>Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
