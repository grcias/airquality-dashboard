import React from 'react';

import styles from './index.module.scss';

const Component = () => {
  return (
    <div className={styles.frame10}>
      <div className={styles.frame7}>
        <img
          src="../image/meths6m4-osomnqk.svg"
          className={styles.fluentTemperature32R}
        />
        <p className={styles.a29C}>29°C</p>
      </div>
      <div className={styles.frame8}>
        <img src="../image/meths6m4-ygz2nyn.svg" className={styles.entypoWater} />
        <p className={styles.a29C}>56%</p>
      </div>
      <div className={styles.frame9}>
        <img src="../image/meths6m4-dte37nt.svg" className={styles.solarWindBold} />
        <p className={styles.a29C}>3.5 m/s</p>
      </div>
    </div>
  );
}

export default Component;
