import React from "react";
import { withRouter } from "react-router-dom";
import img_reservation_success from "../../img/reservation_success.png";
import "./ReservationSuccess.less";

class ReservationSuccess extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="logo_div">
          <img className="logo" src={img_reservation_success} alt="logo" />
        </div>
        <div className="main_tip">预约成功</div>
        <div className="sub_tip">
          我们已通知服务人员。
          <br />
          <br />
          接单后将通过微信消息通知您
          <br />
          请保持关注。
          <br />
          <br />
          感谢您使用小易智能柜预约服务！
        </div>
        <div
          className="btn_tip"
          onClick={() => {
            this.props.history.push("indexPage");
          }}
        >
          返回首页
        </div>
      </div>
    );
  }
}
export default withRouter(ReservationSuccess);
