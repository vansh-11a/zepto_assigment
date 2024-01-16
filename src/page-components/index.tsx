import React from 'react';
import styles from './styles.module.css';
import data from '../configurations/data';
import SelectPills from './SelectPills';

function App () {
  return (
    <div className={styles.main_container}>
      <h1 className={styles.header}>Pick Your Items</h1>
      <div className={styles.content}><SelectPills data={data} /></div>
    </div>
  )
}

export default App;
