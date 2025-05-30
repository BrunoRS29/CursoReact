import TopBar from '../components/TopBar';
import SideBar from '../components/SideBar';
import Fornecedores from '../components/Fornecedores';
import styles from '../styles/Contatos.module.css';

const Contatos = () => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentArea}>
        <SideBar />
        <div className={styles.mainContent}>
          <Fornecedores />
        </div>
      </div>
    </div>
  );
};

export default Contatos;
