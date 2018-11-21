import React from "react";
import { Flex, Modal, Toast, ActivityIndicator } from "antd-mobile";
import "./MyReservation.less";
import { withRouter } from "react-router-dom";
import get from "../../utils/get";
import post from "../../utils/post";
import { timpstampToDate } from "../../utils/dataTransform.js";
import scan_code from "../../img/scan_code.png";

const alert = Modal.alert;

class MyReservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canBeCancel: false,
      hasTaken: false,
      hasDone: false,
      hasOrder: false,
      reservationData: {},
      model1: false,
      model2: false,
      loadingModal: false
    };
  }
  showModal = key => e => {
    // 现象：如果弹出的弹框上的 x 按钮的位置、和手指点击 button 时所在的位置「重叠」起来，
    // 会触发 x 按钮的点击事件而导致关闭弹框 (注：弹框上的取消/确定等按钮遇到同样情况也会如此)
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true
    });
  };
  onClose = key => () => {
    this.setState({
      [key]: false
    });
  };
  componentDidMount() {
    const clientId = window.localStorage.getItem("clientId");
    get("api/reservation/loadTheBookingOrder", {
      clientId: clientId
    }).then(res => {
      console.log("reservaDATA", res);
      if (res.data) {
        if (res.data.code === 28) {
          this.props.history.push("scancode");
        } else if (res.data.code === 0) {
          this.setState({
            reservationData: res.data.data
          });
        }
      }
      //   if (res.data.code == "0") {
      //     if (res.data.data) {

      //     }
      //   }
    });
  }
  // reservation/loadTheBookingOrder GET

  render() {
    const showOpenAlert2 = () => {
      alert("确认开柜取车", "即将打开柜门, 请确保您在柜门前!", [
        {
          text: "算了",
          onPress: () => console.log("cancel"),
          style: "default"
        },
        {
          text: "再次确定",
          onPress: () => {
            // console.log("取消了啊 啊啊");
            this.setState({
              loadingModal: true
            });
            get(
              "api/orders/userTakeOutKey?orderId=" +
                this.state.reservationData.consumOrderId
            ).then(res => {
              console.log(res);
              this.setState({
                loadingModal: false
              });
              if (res.data) {
                if (res.data.code == 0) {
                  this.setState({
                    model2: true
                  });
                } else {
                  Toast.fail(res.data.data, 2);
                }
              }
            });
          }
        }
      ]);
    };
    const showOpenAlert = () => {
      alert("开柜取车", "您是否确定打开柜门?", [
        {
          text: "算了",
          onPress: () => console.log("cancel"),
          style: "default"
        },
        {
          text: "确定",
          onPress: () => {
            showOpenAlert2();
          }
        }
      ]);
    };

    const showAlert2 = () => {
      alert("确认取消预约", "取消预约柜门会打开, 请确保您在柜门前!", [
        {
          text: "算了",
          onPress: () => console.log("cancel"),
          style: "default"
        },
        {
          text: "再次确定",
          onPress: () => {
            console.log("取消了啊 啊啊");
            this.setState({
              loadingModal: true
            });
            post(
              "api/reservation/cancel?id=" + this.state.reservationData.id
            ).then(res => {
              if (res.data.code) {
                if (res.data.code == "0") {
                  console.log("取消成功");
                  this.setState({
                    loadingModal: false,
                    model1: true
                  });
                }
              }
            });
          }
        }
      ]);
    };
    const showAlert = () => {
      alert("取消预约", "您是否确定取消预约?", [
        {
          text: "算了",
          onPress: () => console.log("cancel"),
          style: "default"
        },
        {
          text: "确定",
          onPress: () => {
            showAlert2();
          }
        }
      ]);
    };
    const orderState = this.state.reservationData.state;
    let stateInfo = "";
    if (orderState === 0) {
      stateInfo = "已预约";
    } else if (orderState === 1) {
      stateInfo = "已接单";
    } else if (orderState === 2) {
      stateInfo = "已完工";
    } else if (orderState == 3) {
      stateInfo = "已支付";
    }
    return (
      <div className="body-bac">
        <div className="nav-bar-title">
          <i
            className="back"
            onClick={() => {
              this.props.history.push("/indexPage");
            }}
          />
          本次预约订单
          <i className="scan" />
        </div>
        <Modal
          visible={this.state.model1}
          transparent
          maskClosable={false}
          title="温馨提示"
          footer={[
            {
              text: "返回首页",
              onPress: () => {
                this.setState({
                  model1: false
                });
                this.props.history.push("/indexPage");
              }
            }
          ]}
        >
          <div style={{ height: "1rem", overflow: "hidden" }}>
            取消预约成功 !<br />
          </div>
        </Modal>
        <Modal
          visible={this.state.model2}
          transparent
          maskClosable={false}
          title="温馨提示"
          footer={[
            {
              text: "返回首页",
              onPress: () => {
                this.setState({
                  model2: false
                });
                this.props.history.push("/indexPage");
              }
            }
          ]}
        >
          <div style={{ height: "1rem", overflow: "hidden" }}>
            服务完毕, 感谢您使用小易爱车智能柜!
            <br />
          </div>
        </Modal>
        <Flex className="my-reservation-info" style={{ paddingLeft: ".2rem" }}>
          <Flex.Item>{this.state.reservationData.licensePlate}</Flex.Item>
          <Flex.Item style={{ textAlign: "center" }}>{stateInfo}</Flex.Item>

          <Flex.Item
            style={{
              textAlign: "right",
              paddingRight: ".2rem",
              color: orderState == 0 ? "#ccc" : "#5b87e5"
            }}
            onClick={e => {
              if (orderState == 0) {
                e.preventDefault();
              } else {
                this.props.history.push(
                  "ordertrack?orderId=" +
                    this.state.reservationData.consumOrderId
                );
              }
            }}
          >
            查看详情
          </Flex.Item>
        </Flex>
        <div className="split-line" />
        <Flex className="reservation-detail" style={{ paddingLeft: ".2rem" }}>
          <Flex.Item style={{ flex: 4 }}>
            <p>{this.state.reservationData.services}</p>
          </Flex.Item>
          <Flex.Item className="price" style={{ flex: 1 }}>
            ￥{this.state.reservationData.totalPrice}
          </Flex.Item>
        </Flex>
        <div className="split-line" />
        <Flex className="reservation-detail">
          <Flex.Item style={{ color: "#a0a0a0", paddingLeft: ".2rem" }}>
            <p>
              预约时间:
              {timpstampToDate(this.state.reservationData.createTime)}
            </p>
          </Flex.Item>
        </Flex>
        {/* <Flex style={{ display: orderState == 2 ? "block" : "none" }}>
          <img
            src={scan_code}
            style={{
              width: "70%",
              height: "70%",
              margin: ".5rem 1rem 0"
            }}
            onClick={() => {}}
          />
        </Flex> */}
        <div
          style={{ display: orderState == 0 ? "block" : "none" }}
          className="btn-cancel-reservation"
          onClick={showAlert}
        >
          取消预约
        </div>
        <div
          style={{ display: orderState == 2 ? "block" : "none" }}
          className="btn-reservation"
          onClick={() => {
            this.props.history.push(
              "payorder?orderId=" + this.state.reservationData.consumOrderId
            );
          }}
        >
          支付订单
        </div>
        <div
          style={{ display: orderState == 3 ? "block" : "none" }}
          className="btn-reservation"
          onClick={() => {
            showOpenAlert();
          }}
        >
          开柜取车
        </div>
        <Modal
          title="正在打开柜门，请在柜门打开后取出钥匙。"
          transparent
          maskClosable={false}
          visible={this.state.loadingModal}
          onClose={this.onClose("loadingModal")}
        >
          <ActivityIndicator size="large" />
        </Modal>
      </div>
    );
  }
}
export default withRouter(MyReservation);
