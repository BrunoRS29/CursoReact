import React from 'react'
import styles from '../styles/SideBar.module.css'

const SideBar = () => {
  return (
    <div className={styles.SideBar}>
        <button>Vendas</button>
        <button>Estoque</button>
        <button>Histórico</button>
        <button>Relatório</button>
        <button>Registrar</button>
        <button>Contatos</button>
    </div>
  )
}

export default SideBar