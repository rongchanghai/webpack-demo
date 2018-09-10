import React from 'react';

import styles from './styles.css';


export default class PageB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      com1:'com11'
    }
  }

  componentDidMount() {
  }

  render() {

    return (
      <div  style={{position: "absolute"}}>
        <div className="b">pageB</div>
        <div className={styles.pagebBox}>
        this is css-module style 
        </div>
      </div>
    )
  }
}