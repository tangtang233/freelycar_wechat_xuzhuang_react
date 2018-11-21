import React from 'react';
import { withRouter } from 'react-router-dom';
import img_open_the_door from '../../img/open_the_door.png';
import './CabinetOpened.less';

class CabinetOpened extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="logo_div">
          <img className="logo" src={img_open_the_door} alt="logo" />
        </div>
        <div className="main_tip">柜门已打开</div>
        <div className="sub_tip">请放入您的钥匙, 然后关闭柜门</div>
        <div className="thr_tip">稍后您可在我的预约中查看详情</div>
        <div className="btn_tip" onClick={()=>{
          this.props.history.push('indexPage')
        }}>返回首页</div>
      </div>
    );
  }
}
export default withRouter(CabinetOpened);
