import React from 'react';
import TodoApp from '$component/TodoApp';

import styles from './styles.css';
export default class PageC extends React.Component {
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
        <div className={styles.pageC}>pageC</div>
        <TodoApp/>
      </div>
    )
  }
}