import React from 'react'
import BtVenda from './BtVenda'
import Time from './Time'
import styles from '../styles/TopBar.module.css'
import BtAdd from './BtAdd'

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.leftGroup}>
        <div className={styles.logo}>
          <img src="/logo_com_contorno_branco.png" alt="Logo" />
        </div>
        <button className={styles.venda}>Nova venda</button>
        <button className={styles.addestoque}>Adicionar ao estoque</button>
      </div>
      <Time />
    </div>
  )
}

export default TopBar
