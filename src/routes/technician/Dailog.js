import React from 'react';
import { withRouter } from "react-router-dom";
import { Modal, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import './Dailog.less';

class dailog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal1: true,
    };
  }
  showModal = key => (e) => {
    e.preventDefault();
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  render() {
    const data = [
      { text: '', car: '' , state: 0}, { text: '预约', car: '苏A129BO' , state: 1},
      { text: '', car: '' , state: 0},{ text: '', car: '' , state: 0},
      { text: '', car: '' , state: 0},{ text: '', car: '' , state: 0},
      { text: '', car: '' , state: 0},{ text: '', car: '' , state: 0},
      { text: '', car: '' , state: 0},{ text: '', car: '' , state: 0},
      { text: '', car: '' , state: 0},{ text: '完工', car: '苏A129BO' , state: 3},
      { text: '预约', car: '苏A129BO' , state: 2},{ text: '', car: '' , state: 0},
      { text: '', car: '' , state: 0},{ text: '', car: '' , state: 0}
    ]
    return (
        <Modal
          style={{width: '84%'}}
          transparent
          maskClosable={false}
          closable={true}
          visible={this.state.modal1}
          onClose={this.onClose('modal1')}
          footer={[{ text: '确定', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
        >
          <div className="dailog-box">
            <div className="dailog-title">
              <span>智能柜000001号状态展示</span>
            </div>
            <div className="dailog-grid">
              {data.map((item, index) => {
                return <div className={item.state===0?"dailog-grid-item":(item.state===1?"dailog-grid-item yellow1":(item.state===2?"dailog-grid-item yellow2":"dailog-grid-item yellow3"))} key={index}>
                  <span>{index+1}</span>
                  {item.text}
                  <br/>
                    {item.car}
                  </div>
              })}
            </div>
          </div>
        </Modal>
    );
  }
}

export default withRouter(dailog);
