import React from 'react'
import TopBar from '../components/TopBar'
import SideBar from '../components/SideBar'
import EstoqueTbl from '../components/EstoqueTbl'
import styles from '../styles/Contatos.module.css'



export const Estoque = () => {
  return (
    <div className={styles.container}>
      <TopBar />
      <div className={styles.contentArea}>
        <SideBar />
        <div className={styles.mainContent}>
          <EstoqueTbl />
        </div>
      </div>
    </div>
  )
}

export default Estoque
