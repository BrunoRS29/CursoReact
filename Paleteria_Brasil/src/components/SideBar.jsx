import { NavLink, useLocation } from 'react-router-dom';
import styles from '../styles/SideBar.module.css';

const buttons = [
  { id: 'vendas', label: 'Vendas' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'historico', label: 'Histórico' },
  { id: 'relatorio', label: 'Relatório' },
  { id: 'registrar', label: 'Registrar' },
  { id: 'contatos', label: 'Contatos' },
];

const SideBar = () => {
  const location = useLocation();

  return (
    <div className={styles.SideBar}>
      {buttons.map((btn) => (
        <NavLink
          key={btn.id}
          to={`/${btn.id}`}
          className={({ isActive }) =>
            `${styles.button} ${isActive ? styles.active : ''}`
          }
        >
          {btn.label}
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
