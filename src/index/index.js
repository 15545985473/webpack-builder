import React from 'react';
import ReactDOM from 'react-dom';
import logo from './images/voucher-my.png';
import largeNumberAdd from 'shuailp';
import './index.less'

console.log(largeNumberAdd('1111111', '222222'))



class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      Text: null
    }
  }
  render () {
    const { Text } = this.state;
    const loadComponent = () => {
     
    }

    return <div>
      { Text ? <Text/> : null }
      <img src={ logo }/>
      <div className="page">Index page</div>
      <button onClick={loadComponent}>button</button>
    </div>
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));