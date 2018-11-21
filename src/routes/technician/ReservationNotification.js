import React from "react";
import {
  Tabs,
  Accordion,
  List,
  Flex,
  Toast,
  Modal,
  ActivityIndicator
} from "antd-mobile";
import { withRouter } from "react-router-dom";
import arrowdown_selected from "../../img/arrowdown_selected.png";
import arrowdown_unselected from "../../img/arrowdown_unselected.png";
import "./ReservationNotification.less";
import CabinetHeader from "../technician/CabinetHeader";
import TechBottomBar from "../technician/TechBottomBar";
import get from "../../utils/get";
import { timpstampToDate } from "../../utils/dataTransform.js";

const TabPane = Tabs.TabPane;

let webSocket;
class ReservationNotification extends React.Component {
  onChange = key => {
    console.log(key);
  };

  constructor(props) {
    super(props);
    this.state = {
      nowTab: 1,
      searchText: "",
      userInputTime: true,
      reservationTime: false,
      reservations: [],
      modal1: false,
      loadingModal: false,
      grids: []
    };
  }

  componentWillMount() {
    window.webSocketUrl =
      "ws://www.freelycar.com/freelycar_wechat/webSocket/" +
      localStorage.getItem("staffId");
  }

  componentWillUnmount() {
    webSocket.close();
  }

  openSocket = () => {
    if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
      console.log("WebSocket is already opened.");
    }
    webSocket.onopen = function(event) {
      if (event.data === undefined) {
        return;
      }
    };
    webSocket.onmessage = event => {
      console.log(event);
      if (event.data) var data = JSON.parse(event.data);
      if (
        data.message &&
        data.message.type &&
        data.message.type == "orderChanged"
      ) {
        console.log("query");
        this.onUserTimeSort();
      }
    };
  };
  componentDidMount() {
    console.log(window.webSocketUrl);
    webSocket = new WebSocket(window.webSocketUrl);
    this.openSocket();

    this.onUserTimeSort();
    get(
      "api/deviceStateInfo/showDeviceStateInfo?cabinetSN=" +
        window.localStorage.getItem("cabinetSN")
    ).then(res => {
      console.log("格子", res);
      if (res.data.code == 0) {
        this.setState({
          grids: res.data.data
        });
      } else {
        Toast.fail(res.data.msg, 2);
      }
    });
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
  onUserTimeSort(e) {
    this.setState({
      userInputTime: true,
      reservationTime: false
    });
    get(
      "api/reservation/list?sortColumn=pickUpTime&state=0&sortType=asc&licensePlate=" +
        (e == undefined ? "" : e)
    ).then(res => {
      if (res.data) {
        if (res.data.code == 0) {
          this.setState({
            reservations: res.data.data
          });
        } else {
          this.setState({
            reservations: []
          });
          Toast.fail(res.data.msg, 2);
        }
      }
    });
  }

  onReservationSort(e) {
    this.setState({
      userInputTime: false,
      reservationTime: true
    });
    get(
      "api/reservation/list?sortColumn=createTime&state=0&sortType=asc&licensePlate=" +
        (e == undefined ? "" : e)
    ).then(res => {
      if (res.data) {
        if (res.data.code == 0) {
          this.setState({
            reservations: res.data.data
          });
        } else {
          Toast.fail(res.data.msg, 2);
        }
      }
    });
  }

  render() {
    const reservated = this.state.reservations.map((item, index) => {
      console.log(item);
      return (
        <div className="tech-cabinet-body">
          {/* <div style={{ marginTop: 10, marginBottom: 10 }}> */}

          <Accordion
            defaultActiveKey="0"
            className="my-reservation"
            onChange={this.onChange}
          >
            <Accordion.Panel
              key={index}
              header={
                <div>
                  <div className="tech-cabinet-index">
                    <div>{index + 1}</div>
                  </div>
                  <div className="tech-cabinet-item">
                    <span>
                      {item.gridSN}
                      号柜
                    </span>
                    <span>{item.licensePlate}</span>
                    <span>{item.carBrand}</span>
                    {/* <span>{item.car}</span> */}
                    <button
                      onClick={e => {
                        // this.showModal("loadingModal");
                        this.setState({
                          loadingModal: true
                        });
                        e.stopPropagation();

                        console.log("aaa");
                        get(
                          "api/orders/getKeyToService?reservationId=" +
                            item.id +
                            "&deviceId=" +
                            item.cabinetSN +
                            "-" +
                            item.gridSN +
                            "&staffId=" +
                            localStorage.getItem("staffId")
                        ).then(res => {
                          console.log(res);
                          this.setState({
                            loadingModal: false
                          });
                          if (res.data) {
                            if (res.data.code == 0) {
                              this.props.history.push("/cabinetServeOpen");
                            } else {
                              Toast.fail(res.data.msg, 2);
                            }
                          }
                        });
                      }}
                    >
                      一键开柜
                    </button>
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
                </div>
              }
              showArrow={false}
            >
              <div className="my-reservation-info">
                <Flex className="item-flex">
                  <div className="my-reservation-first">
                    <Flex.Item className="item-flex">
                      <p>车主姓名:</p>
                    </Flex.Item>
                  </div>
                  <Flex.Item className="car-num">{item.name}</Flex.Item>
                </Flex>
              </div>

              <div className="split-line" />
              <div className="my-reservation-info">
                <Flex className="item-flex">
                  <div className="my-reservation-first">
                    <Flex.Item className="item-flex">
                      <p style={{ marginTop: "0.1rem" }}>预约信息:</p>
                    </Flex.Item>
                    {/* {projects} */}
                    {item.services}
                  </div>
                  {/* <Flex.Item className="car-num">小车</Flex.Item> */}
                </Flex>
              </div>
              <div className="split-line" />
              <div className="my-reservation-info">
                <Flex className="item-flex">
                  <div className="my-reservation-first">
                    <Flex.Item className="item-flex">
                      <p>预约时间:</p>
                    </Flex.Item>
                  </div>
                  <Flex.Item className="car-num">
                    {timpstampToDate(item.createTime)}
                  </Flex.Item>
                </Flex>
              </div>
              <div className="split-line" />

              <div className="my-reservation-info">
                <Flex className="item-flex">
                  <div className="my-reservation-first">
                    <Flex.Item className="item-flex">
                      <p>钥匙位置:</p>
                    </Flex.Item>
                  </div>
                  <Flex.Item className="car-num">
                    <span
                      style={{ color: "#5b87e5" }}
                      onClick={() => {
                        this.setState({
                          modal1: true
                        });
                      }}
                    >
                      {item.cabinetName}-{item.gridSN}
                      号柜
                    </span>
                  </Flex.Item>
                </Flex>
                <Modal
                  style={{ width: "84%" }}
                  transparent
                  maskClosable={false}
                  closable={true}
                  visible={this.state.modal1}
                  onClose={this.onClose("modal1")}
                  footer={[
                    {
                      text: "确定",
                      onPress: () => {
                        console.log("ok");
                        this.onClose("modal1")();
                      }
                    }
                  ]}
                >
                  <div className="dailog-box">
                    <div className="dailog-title">
                      <span>
                        {item.cabinetName}
                        状态展示
                      </span>
                    </div>
                    <div className="dailog-grid">
                      {this.state.grids.map((item, index) => {
                        return (
                          <div
                            className={
                              item.state === 0
                                ? "dailog-grid-item"
                                : item.state === 1
                                  ? "dailog-grid-item yellow1"
                                  : "dailog-grid-item yellow3"
                            }
                            key={index}
                          >
                            <span>{index + 1}</span>
                            <div className="grid-text">{item.state === 0
                              ? ""
                              : item.state === 1
                                ? "已预约"
                                : "已完工"}
                            <br />
                            {item.licensePlate}</div>
                            
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="split-line" />
              <div className="my-reservation-info">
                <Flex className="item-flex">
                  <div className="my-reservation-first">
                    <Flex.Item className="item-flex">
                      <p>停放位置:</p>
                    </Flex.Item>
                  </div>
                  <Flex.Item className="car-num">{item.location}</Flex.Item>
                </Flex>
              </div>
            </Accordion.Panel>
          </Accordion>
        </div>
      );
    });
    return (
      <div>
        <CabinetHeader
          handleTextChange={e => {
            // this.setState({
            //   searchText: e
            // });
            // console.log(e)
            this.onUserTimeSort(e);
          }}
        />
        <div className="sort">
          <span className="sort-name">排序</span>
          <span onClick={() => this.onUserTimeSort()}>
            <span className="sort-type-take-time">按提车顺序</span>
            <img
              src={
                this.state.userInputTime
                  ? arrowdown_selected
                  : arrowdown_unselected
              }
            />
          </span>
          <span onClick={() => this.onReservationSort()}>
            <span className="sort-type-reserve-time">按预约时间</span>
            <img
              src={
                this.state.reservationTime
                  ? arrowdown_selected
                  : arrowdown_unselected
              }
            />
          </span>
        </div>
        <div style={{ marginBottom: "1rem" }}>{reservated}</div>
        {/* <div className="empty-bac" style={{display:this.state.services.length < 1?'block':'none'}}></div> */}
        <TechBottomBar nowTab={2} />
      </div>
    );
  }
}
export default withRouter(ReservationNotification);
