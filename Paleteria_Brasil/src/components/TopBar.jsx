import React from 'react'
import BtVenda from './BtVenda'
import Time from './Time'
import styles from '../styles/TopBar.module.css'
import BtAdd from './BtAdd'

const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>
        <img src="/logo_com_contorno_branco.png" alt="Logo"/>
      </div>
      <BtVenda />
      <BtAdd/>
      <Time />
    </div>
  )
}

export default TopBar
