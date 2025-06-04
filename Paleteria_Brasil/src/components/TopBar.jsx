import React from 'react'
import BtVenda from './BtVenda'
import Time from './Time'
import styles from '../styles/TopBar.module.css'
import BtAdd from './BtAdd'
import logo from '../assets/logo.png';


const TopBar = () => {
  return (
    <div className={styles.topbar}>
      <div className={styles.leftGroup}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>
        <BtVenda/>
        <BtAdd/>
      </div>
      <Time />
    </div>
  )
}

export default TopBar
