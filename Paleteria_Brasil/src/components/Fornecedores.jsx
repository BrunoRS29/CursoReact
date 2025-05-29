import { useEffect, useState } from 'react';

export default function Fornecedores() {
    const [fornecedores, setFornecedores] = useState([]);
    const [form, setForm] = useState({id: '', cnpj: '', nome_fornecedor: '', telefone: '' });
    const [modoEdicao, setModoEdicao] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const baseUrl = 'http://localhost:8080';

    const buscarFornecedores = async () => {
        try {
            const response = await fetch("http://localhost:8080/fornecedor/listar");
            if (!response.ok) throw new Error("Erro na requisição");

            const data = await response.json();
            setFornecedores(data);
        } catch (error) {
            console.error("Erro ao buscar fornecedores:", error);
            setFornecedores([]); // ou null, mas cuidado com o uso de map
        }
    };

    const adicionarFornecedor = async () => {
    await fetch(`${baseUrl}/fornecedor/inserir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    await buscarFornecedores();
    limparFormulario();
    };

    const atualizarFornecedor = async () => {
    await fetch(`${baseUrl}/fornecedor/alterar/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
    });
    await buscarFornecedores();
    limparFormulario();
    };

    const removerFornecedor = async () => {
    await fetch(`${baseUrl}/fornecedor/remover/${form.id}`, {
        method: 'DELETE',
    });
    await buscarFornecedores();
    limparFormulario();
    };


  const selecionarFornecedor = (fornecedor) => {
    setForm(fornecedor);
    setModoEdicao(true);
  };

  function limparFormulario() {
  setForm({ id: '', cnpj: '', nome_fornecedor: '', telefone: '' });
  setModoEdicao(false);
}


    useEffect(() => {
    buscarFornecedores();
  }, []);

  return (
    <div>
    
      <h2>Gerenciar Fornecedores</h2>

     
      
      <div>
        <input name="cnpj" placeholder="CNPJ" value={form.cnpj} onChange={handleChange}/>
        <input name="nome_fornecedor" placeholder="Nome" value={form.nome_fornecedor} onChange={handleChange} />
        <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
      </div>

      <div>
        {!modoEdicao ? (
          <button onClick={adicionarFornecedor}>Adicionar</button>
        ) : (
          <>
            <button onClick={atualizarFornecedor}>Atualizar</button>
            <button onClick={removerFornecedor}>Remover</button>
            <button onClick={limparFormulario}>Cancelar</button>
          </>
        )}
      </div>

      <table border="1">
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
              <td>
                <button onClick={() => selecionarFornecedor(f)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
