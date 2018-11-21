import React from "react";
import "./PersonalInfo.less";
import { List, InputItem, WhiteSpace, Picker } from "antd-mobile";
import { createForm } from "rc-form";
import { Flex } from "antd-mobile";
import NavBar from "../../components/NavBar";
import login from "../../img/logo.png";
import { wxInfo, updateWXUser } from "../../services/user.js";
import getParameterByName from "../../utils/getParam.js";
import { withRouter } from "react-router-dom";
class PersonalInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      focused1: false,
      trueName: "",
      headimgurl: "",
      birthday: "",
      phone: ""
      // nickName: window.localStorage.getItem("nickName")
    };
  }

  componentDidMount() {
    wxInfo({
      // openId: window.localStorage.getItem("openid")
      phone: window.localStorage.getItem("phone")
    })
      .then(res => {
        console.log(res);
        if (res.data.code == "0") {
          let data = res.data.data;
          this.setState({
            point: data.point,
            // nickName: data.wxUser.nickName,
            trueName: data.wxUser.name,
            headimgurl: data.wxUser.headimgurl,
            nickName: data.wxUser.nickName,
            // phone: data.wxUser.phone,
            phone: window.localStorage.getItem("phone"),
            // birthday: data.wxUser.birthday
            //   ? data.wxUser.birthday.slice(0, 10)
            //   : "",
            gender: [data.wxUser.gender]
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  updateInfo() {
    updateWXUser({
      // openId: '1',
      phone: window.localStorage.getItem("phone"),
      // phone: '110',
      //   birthday: this.state.birthday,
      //   name: this.state.name,
      gender: this.state.gender[0],
      name: this.state.trueName
      // phone: this.state.phone
    }).then(res => {
      //   console.log(res);
      if (getParameterByName("nextPage")) {
        this.props.history.push(`/addcar/0?nextPage=true`);
      } else if (getParameterByName("noName")) {
        this.props.history.push(`/orderbilling`);
      } else {
        this.props.history.push(`/indexPage`);
      }
    });
  }

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div className="body-bac">
        <NavBar title="个人信息" />
        <List className="add-car-info personal-info">
          <Flex justify="center" style={{ height: "1.6rem" }}>
            <img
              className="logo"
              src={decodeURIComponent(
                window.localStorage.getItem("headimgurl")
              )}
              style={{ width: "1.16rem" }}
            />
          </Flex>

          {/* <List.Item
                    clear
                    placeholder="账户阅读,提醒信息"
                    autoFocus
                    extra={this.state.nickName}
                    className="personInfo-gender"
                >昵称</List.Item> */}
          <InputItem
            clear
            placeholder="请填写真实姓名"
            focused={this.state.focused}
            value={this.state.trueName}
            onFocus={() => {
              this.setState({
                focused: false
              });
            }}
            onChange={value => {
              this.setState({
                trueName: value
              });
            }}
          >
            <span style={{ color: "red" }}>真实姓名*</span>
          </InputItem>
          <InputItem
            // clear
            value={this.state.nickName}
            style={{ font: "0.32rem 黑体", color: "#1e1e1e" }}
            editable={false}
          >
            昵称
          </InputItem>
          <Picker
            // extra="男 / 女"
            data={[{ label: "男", value: "男" }, { label: "女", value: "女" }]}
            cols={1}
            value={this.state.gender}
            onChange={value => {
              this.setState({
                gender: value
              });
            }}
          >
            <List.Item
              style={{ borderBottom: "1px solid #efefef"}}
              className={"personInfo-gender"}
            >
              性别
            </List.Item>
          </Picker>

          <InputItem
            // style={{textAlign:'left'}}
            clear
            // placeholder="18018018080"
            focused={this.state.focused}
            value={this.state.phone}
            editable={false}
            onFocus={() => {
              this.setState({
                focused: false
              });
            }}
            onChange={value => {
              this.setState({
                phone: value
              });
            }}
          >
            手机号
          </InputItem>

          {/* <InputItem
                    clear
                    placeholder="1990-08-08"
                    focused={this.state.focused}
                    value={this.state.birthday ? this.state.birthday.slice(0, 10) : this.state.birthday}
                    onFocus={() => {
                        this.setState({
                            focused: false,
                        });
                    }}
                    onChange={(value) => {
                        this.setState({
                            birthday: value
                        })
                    }}
                >生日</InputItem> */}
        </List>

        <div
          className={this.state.trueName ? "addCar-btn" : "addCar-btn-disable"}
          onClick={e => {
            // window.localStorage.setItem("isInfoSaved", true);
            this.state.trueName ? this.updateInfo() : e.preventDefault();
          }}
        >
          保存
        </div>
        {/* <div style={{ color: '#5a5a5a', marginTop: '.25rem', textAlign: 'right', paddingRight: '.22rem' }} onClick={() => { this.props.history.push(`/indexPage`) }}>跳过</div> */}
      </div>
    );
  }
}

const Personal = createForm()(PersonalInfo);

export default withRouter(Personal);
