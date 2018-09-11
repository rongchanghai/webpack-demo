import React from 'react';
import TodoApp from '$component/TodoApp';

export default class PageA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      com1:'com111'
    }
  }

  componentDidMount() {
  }
  clickBtn = ()=>{
    console.log('click Btn');
  }
  render() {
    console.log('Aa');
    return (
      <div style={{position: "absolute"}}>
        <div className="b">pageAA</div>
        <button onClick={this.clickBtn}>click this</button>
        <TodoApp/>
      </div>
    )
  }
}