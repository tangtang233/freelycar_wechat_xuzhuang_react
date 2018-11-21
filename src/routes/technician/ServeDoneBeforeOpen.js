import React from "react";
import NavBar from "../../components/NavBar";
import {
  Flex,
  TextareaItem,
  DatePicker,
  List,
  Toast,
  ActivityIndicator,
  Modal
} from "antd-mobile";
import "./ServeDoneBeforeOpen.less";
import img_blue from "../../img/blue.png";
import { withRouter } from "react-router-dom";
import getParameterByName from "../../utils/getParam.js";
import get from "../../utils/get";

class ServeDoneBeforeOpen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: {},
      projectName: "",
      parkingLocation: "",
      cabinetSN: "",
      loadingModal: false
    };
  }
  showModal = key => e => {
    e.preventDefault();
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
    let orderId = getParameterByName("consumOrderId");
    let cabinetSN = getParameterByName("cabinetSN");
    get("api/orders/detail?consumOrderId=" + orderId).then(res => {
      // console.log(res)
      if (res.data.code == "0") {
        this.setState({
          order: res.data.orders,
          projectName: res.data.orders.projects[0].projectInfo.name,
          cabinetSN: cabinetSN
        });
        console.log(this.state.order);
      }
    });
  }
  render() {
    return (
      <div className="body-bac">
        <div className="nav-bar-title">
          {/* <i
            className="back"
            onClick={() => {
              this.props.history.push("/");
            }}
          /> */}
          订单详情
          {/* <i className="scan" /> */}
        </div>

        <Flex className="serve-my-reservation-info">
          <Flex.Item className="serve-reservation-time">
            <p>车牌号码:</p>
          </Flex.Item>
          <Flex.Item className="car-num">
            {this.state.order.licensePlate}
          </Flex.Item>
        </Flex>

        <Flex className="serve-reservation-detail">
          <Flex.Item className="serve-reservation-name">
            <p>车主姓名：</p>
          </Flex.Item>
          <Flex.Item className="name">{this.state.order.clientName}</Flex.Item>
        </Flex>

        <Flex className="serve-reservation-item">
          <Flex.Item className="item">
            <p>施工项目：</p>
          </Flex.Item>
          <Flex.Item className="item-name">{this.state.projectName}</Flex.Item>
        </Flex>

        <Flex className="serve-reservation-block-box3">
          <div
            style={{
              font: "0.26rem 黑体",
              color: "#1e1e1e",
              paddingTop: "0.3rem",
              marginBottom: "0.32rem"
            }}
          >
            <img
              src={img_blue}
              style={{
                width: "0.06rem",
                height: "0.28rem",
                verticalAlign: "middle"
              }}
              alt=""
            />
            <span style={{ marginLeft: "0.46rem" }}>
              请填写您的车辆停放位置
            </span>
          </div>
        </Flex>
        <div className="serve-reservation-block-box4-outer">
          <TextareaItem
            onChange={e => {
              this.setState({
                parkingLocation: e
              });
              console.log(e);
            }}
            className="serve-reservation-block-box4"
            placeholder=" 请尽量详细地填写，方便车主寻找。
                              如：金奥费尔蒙停车场负二层F12"
            // style={{height:'2rem', textAlign:'top'}}
            rows="3"
          />
        </div>
        <div
          className={
            this.state.parkingLocation
              ? "serve-btn-cancel-reservation"
              : "serve-btn-reservation"
          }
          onClick={e => {
            if (!this.state.parkingLocation) {
              e.preventDefault();
            } else {
              this.setState({
                loadingModal: true
              });
              get(
                "api/orders/serviceFinish?orderId=" +
                  this.state.order.id +
                  "&cabinetSN=" +
                  this.state.cabinetSN +
                  "&parkingLocation=" +
                  this.state.parkingLocation
              ).then(res => {
                this.setState({
                  loadingModal: false
                });
                if (res.data.code == 0) {
                  Toast.success('您已成功交车!',2);
                  this.props.history.push("/serving");
                } else {
                  Toast.fail(res.data.msg, 2);
                }
              });
            }
          }}
        >
          一键开柜
        </div>
        <Modal
          title="正在打开柜门，请在柜门打开后放入钥匙。"
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
export default withRouter(ServeDoneBeforeOpen);
