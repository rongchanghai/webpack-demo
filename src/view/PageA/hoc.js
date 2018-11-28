import React from 'react';

export default function list(WrappedComponent) {
  return class PP extends WrappedComponent {
    constructor(props) {
      super(props)
      this.state = {
        list: [1,2,3]
      }
    }
  }
}

