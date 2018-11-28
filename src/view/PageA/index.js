import React from 'react';
import TodoApp from '$component/TodoApp';
import MyContainer from './hoc'
@MyContainer
export default class PageA extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   com1: 'com111'
    // }
  }

  componentDidMount() {
  }
  clickBtn = () => {
    console.log('click Btn');
  }
  render() {
    console.log('Aa');
    console.log(this.state.list);
    return (
      <div style={{ position: "absolute" }}>
        <>
          <div>A</div>
          <div>A</div>
          <div>A</div>
          <div>A</div>
        </>
      </div>
    )
  }
}