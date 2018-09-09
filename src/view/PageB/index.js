import React from 'react';
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
      </div>
    )
  }
}