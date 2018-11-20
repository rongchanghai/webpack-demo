import React from 'react';
import TodoApp from '$component/TodoApp';
import css from './styles.css'
import img from './15.jpg';
import imgBig from './65.jpg'

export default class PageB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      com1: 'com11'
    }
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className={css.boxA}>
        <div className={css.boxB}>
          Abcd
        </div>
      </div>
    )
  }
}