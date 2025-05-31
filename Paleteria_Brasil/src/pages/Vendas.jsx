import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import NovaVenda from '../components/NovaVenda'
import styles from '../styles/Contatos.module.css';

const Vendas = () => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentArea}>
        <SideBar />
        <div className={styles.mainContent}>
          <NovaVenda />
        </div>
      </div>
    </div>
  )
}

export default Vendas