import React from 'react';
import { withRouter } from 'react-router-dom';
import img_open_the_door from '../../img/open_the_door.png';
import './CabinetDoneOpenUser.less';

class CabinetDoneOpenUser extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="logo_div">
          <img className="logo" src={img_open_the_door} alt="logo" />
        </div>
        <div className="main_tip">柜门已打开</div>
        <div className="sub_tip">请取走您的钥匙, 然后关闭柜门</div>
      </div>
    );
  }
}
export default withRouter(CabinetDoneOpenUser);
