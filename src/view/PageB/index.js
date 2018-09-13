import React from 'react';
import TodoApp from '$component/TodoApp';
import img from './15.jpg';
import imgBig from './65.jpg'

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
        <img src={img} alt=""/>
        <img src={imgBig} alt=""/>
        <TodoApp/>
      </div>
    )
  }
}