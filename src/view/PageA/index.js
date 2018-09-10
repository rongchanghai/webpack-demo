import React from 'react';

import styles from './styles.css';
import lessStyles from './lessStyle.less';

export default class PageA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      com1: 'com11'
    }
  }

  componentDidMount() {
  }

  clickBtn = () => {
    console.log('click Btn');
  }
  render() {
    console.log('AaAAAAbbb');
    return (
      <div style={{ position: "absolute" }}>
        <div className="b">pageAA</div>
        <button onClick={this.clickBtn}>click this</button>
        <div className={lessStyles.pageAless}>this is less style, but use css-loader with css-module </div>
        <div className={styles.wrapper}>
          <ul className={styles.stage}>
            <li className={styles.scene}>
              <div className={styles.movie}>
                <div className={styles.poster}></div>
                <div className={styles.info}>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
