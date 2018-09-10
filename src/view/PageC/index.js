import React from 'react';

import './styles.less'


export default class PageC extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {

    return (
      <div  style={{position: "absolute"}}>
        <div className="pageCBox">
        直接import less 文件 无效 
        想要支持这种导入的方法可以
        
        <pre>
        use: [
            'style-loader',
            'css-loader',
            'less-loader'
          ]
        </pre>
        
        </div>
      </div>
    )
  }
}