import React from 'react';
import TodoApp from '$component/TodoApp';


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
        <TodoApp/>
      </div>
    )
  }
}