import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import Produtos from '../components/Produtos'
import styles from '../styles/Contatos.module.css';

const Registrar = () => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentArea}>
        <SideBar />
        <div className={styles.mainContent}>
          <Produtos />
        </div>
      </div>
    </div>
  );
}

export default Registrar