import React from 'react';
import { withRouter } from "react-router-dom";
import img_open_the_door from '../../img/open_the_door.png';
import './CabinetServeOpen.less';

class CabinetServeOpen extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="logo_div">
                    <img className="logo" src={img_open_the_door} alt="logo"/>
                </div>
                
                <div className="main_tip">
                    操作成功
                </div>
                <div className="sub_tip">
                   您已经成功取出钥匙！
                </div>
                <div className = "start_server_btn" onClick={()=>{
                    this.props.history.push('/reservationNotification')
                }}>
                开始服务
                </div>
            </div>
        )
    }
}
export default withRouter(CabinetServeOpen);


