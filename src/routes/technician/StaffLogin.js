import React from "react";
import "./StaffLogin.less";
import { Flex, Toast } from "antd-mobile";
import login from "../../img/logo.png";
// import shutdown from '../../img/shutdown.png';
import phone from "../../img/phone.png";
import password from "../../img/password.png";
import button_login from "../../img/button_login.png";
import { verification, verifySmsCode } from "../../services/sms.js";
import { withRouter } from "react-router-dom";
import get from "../../utils/get";
import post from "../../utils/post";
import getParameterByName from "../../utils/getParam.js";
class StaffLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: null,
      password: null
    };
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  staffLogin() {
    post("api/staff/login", {
      account: this.state.account,
      password: this.state.password
    }).then(res => {
      console.log(res);
      if(res.data){
          if(res.data.code==0){
            localStorage.setItem('staffId',res.data.data.id);
            this.props.history.push('/reservationNotification');
          }
          else{
            Toast.fail(res.data.msg, 2);
            //     return 0;
          }
      }
      //   if (res.data.code) {
      //     Toast.fail(res.data.msg, 2);
      //     return 0;
      //   }
      //   if (res.data.client.phone) {
      //     window.localStorage.setItem(
      //       "headimgurl",
      //       getParameterByName("headimgurl")
      //     );

      //     window.localStorage.setItem("openid", getParameterByName("openid"));

      //     //this.props.history.push(`/${getParameterByName('directUrl')  == 'ordertrack' ? 'ordertrack?orderId=$' : getParameterByName('directUrl') }`)
      //     if (window.localStorage.getItem("isInfoSaved")) {
      //       this.props.history.push(`/indexPage`);
      //     } else {
      //       this.props.history.push(`/${getParameterByName("directUrl")}`);
      //     }
      //   }
    });
  }
  render() {
    return (
      <div
        className="loginbg"
        style={{ height: window.document.body.clientHeight }}
      >
        <div className="panel" style={{ height: "7.6rem" }}>
          <Flex justify="center">
            <img className="logo" src={login} />
          </Flex>
          <Flex justify="center">
            <div className="input-up">
              <img
                src={phone}
                style={{
                  width: ".3rem",
                  marginLeft: ".18rem",
                  marginRight: "0.5rem",
                  verticalAlign: "middle"
                }}
              />
              <input
                className="no-border"
                style={{ width: "4.3rem" }}
                onChange={e => {
                  this.setState({
                    account: e.target.value,
                  });
                }}
                placeholder="请输入技师账号"
              />
            </div>
          </Flex>
          <Flex justify="center">
            <div className="input-up">
              <img
                src={password}
                style={{
                  width: ".34rem",
                  marginLeft: ".18rem",
                  marginRight: "0.48rem",
                  verticalAlign: "middle"
                }}
              />
              <input
                className="no-border"
                placeholder="请输入密码"
                style={{ display: "inner-block", width: "2rem" }}
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
              />
            </div>
          </Flex>
          <div>
            <br />
          </div>
          <div
            style={{
              height: "0.98rem",
              textAlign: "center",
              color: "#fff",
              borderRadius: "10rem",
              lineHeight: "0.98rem",
              margin: "0 .48rem 0 .48rem",
              background: "#5b87e5"
            }}
            onClick={() => {
              this.staffLogin();
            }}
          >
            登 录
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(StaffLogin);
