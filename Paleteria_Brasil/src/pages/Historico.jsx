import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import VendasFiltradas from '../components/VendasFiltradas'
import styles from '../styles/Contatos.module.css';

const Historico = () => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentArea}>
        <SideBar />
        <div className={styles.mainContent}>
          <VendasFiltradas />
        </div>
      </div>
    </div>
  )
}

export default Historico
