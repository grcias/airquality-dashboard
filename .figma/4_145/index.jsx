import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame18}>
      <div className={styles.frame11}>
        <p className={styles.good}>Good</p>
      </div>
      <div className={styles.frame13}>
        <p className={styles.good}>Moderate</p>
      </div>
      <div className={styles.frame14}>
        <p className={styles.good}>Unhealthy</p>
      </div>
      <div className={styles.frame16}>
        <p className={styles.good}>Very Unhealthy</p>
      </div>
      <div className={styles.frame17}>
        <p className={styles.good}>Hazardous</p>
      </div>
    </div>
  );
}

export default Component;
