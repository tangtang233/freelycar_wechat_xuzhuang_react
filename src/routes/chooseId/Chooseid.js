import React from "react";
import { Flex, Radio } from "antd-mobile";
import item from "../../img/item.png";
import user_logo from "../../img/user_logo.png";
import worker_logo from "../../img/worker_logo.png";
import yes from "../../img/yes.png";
import no from "../../img/no.png";
import "./Chooseid.less";
import getParameterByName from "../../utils/getParam";
// const RadioGroup = Radio.Group;
const RadioItem = Radio.RadioItem;
class Chooseid extends React.Component {
  state = {
    idValue: 0
  };
  onChange = val => {
    this.setState({
      idValue: val
    });
  };

  componentWillMount() {
    window.localStorage.setItem("cabinetSN", getParameterByName("cabinetSN"));

    if (window.localStorage.getItem("staffId") != null) {
      this.props.history.push("/reservationNotification");
      return;
    }
    if (window.localStorage.getItem("clientId") != null) {
      this.props.history.push("/orderbilling");
      return;
    }
  }

  Login = () => {
    this.state.idValue === 0
      ? this.props.history.push(
          "/login" +
            window.location.href.substring(window.location.href.indexOf("?")) +
            "&nextPage=true"
        )
      : this.props.history.push("/stafflogin");
  };

  render() {
    return (
      <div className="body-bg">
        <div className="top-content">
          <img className="top" src={item} alt="" />
          <p className="top-title">
            您好，欢迎使用【小易爱车智能钥匙柜】预约服务
          </p>
        </div>
        <div className="blank">
          <p className="id-title">选择身份</p>
          <div className="id-content">
            <p>欢迎使用【小易爱车智能钥匙柜】为您的爱车预</p>
            <p>约服务，请选择您的身份</p>
          </div>
          <div className="user-worker">
            <img className="user-logo" src={user_logo} />
            <img className="worker-logo" src={worker_logo} />
            <p>
              <span
                className="space"
                style={{
                  marginRight: "1.3rem",
                  font: "0.26 黑体",
                  color: "#a0a0a0"
                }}
              >
                我是用户
              </span>
              <span
                className="space"
                style={{ font: "0.26 黑体", color: "#a0a0a0" }}
              >
                {" "}
                我是员工
              </span>
            </p>
            <Flex justify="center" style={{ padding: "0.22rem" }}>
              <img
                className="yes-logo"
                src={this.state.idValue === 0 ? yes : no}
                onClick={() => this.onChange(0)}
              />
              <img
                className="no-logo"
                src={this.state.idValue === 1 ? yes : no}
                onClick={() => this.onChange(1)}
              />
            </Flex>
          </div>
          <div
            style={{
              height: "0.98rem",
              textAlign: "center",
              color: "#fff",
              borderRadius: "10rem",
              lineHeight: "0.98rem",
              margin: "0.02rem 0.48rem",
              background: "#5b87e5"
            }}
            onClick={() => {
              this.Login();
            }}
          >
            确认选择
          </div>
        </div>
      </div>
    );
  }
}
export default Chooseid;
