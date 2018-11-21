import React from "react";
import { withRouter } from "react-router-dom";
import CabinetHeader from "../technician/CabinetHeader";
import TechBottomBar from "./TechBottomBar";
import get from "../../utils/get";
import { Tabs, WhiteSpace, Badge, Flex, Toast } from "antd-mobile";
import "./TechCabinet.less";
import { timpstampToDate } from "../../utils/dataTransform.js";

const TabPane = Tabs.TabPane;

let webSocket;
class Serving extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nowTab: 1,
      serves: [],
      services: [
        {
          title: "苏A123AO",
          car: "宝马X1",
          type: "普洗",
          time: "2018-05-09 10:30:00",
          state: 1
        },
        {
          title: "苏ASS007",
          car: "奥迪A4",
          type: "普洗",
          time: "2018-05-09 10:30:00",
          state: 1
        }
      ],
      cards: [
        {
          title: "苏A124R0",
          car: "宝马S3",
          box: 1
        },
        {
          title: "苏A78R07",
          car: "奥迪A4",
          box: 3
        },
        {
          title: "苏A12XX7",
          car: "大众荣威",
          box: 6
        }
      ]
    };
  }

  componentWillMount() {
    window.webSocketUrl =
      "ws://www.freelycar.com/freelycar_wechat/webSocket/" +
      localStorage.getItem("staffId");
  }
  componentDidMount() {
    console.log(window.webSocketUrl);
    webSocket = new WebSocket(window.webSocketUrl);
    this.openSocket();
    this.onUserTimeSort();
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

  onUserTimeSort(e) {
    get(
      "api/reservation/list?state=1&licensePlate=" + (e == undefined ? "" : e)
    ).then(res => {
      console.log(res);
      if (res.data) {
        if (res.data.code == 0) {
          this.setState({
            serves: res.data.data
          });
        } else {
          this.setState({
            serves: []
          });
          Toast.fail(res.data.msg, 2);
        }
      }
    });
  }
  render() {
    // const serving
    const serving = this.state.serves.map((item, index) => {
      return (
        <div className="tech-cabinet-body">
          <Flex className="my-reservation-info">
            <div className="little-box" />
            <Flex.Item className="reservation-time">
              <span>{item.licensePlate}</span>
              {/* {this.state.createDate} */}
            </Flex.Item>
            <Flex.Item className="car-num">{item.carBrand}</Flex.Item>
          </Flex>

          <div className="order-track-line" />

          <div style={{ margin: "0 .22rem 0 .22rem", backgroundColor: "#fff" }}>
            <div className="order-list">
              <Flex style={{ height: "100%" }}>
                <Flex.Item className="leftLable">服务项目</Flex.Item>
                <Flex.Item className="rightText">
                  {/* {this.state.createDate} */}
                  {item.services}
                </Flex.Item>
              </Flex>
            </div>
            <div className="pay-order-line-dashed" />

            <div className="order-list">
              <Flex style={{ height: "100%" }}>
                <Flex.Item className="leftLable">接单时间</Flex.Item>
                <Flex.Item className="rightText">
                  {timpstampToDate(item.orderTime)}
                </Flex.Item>
              </Flex>
            </div>
            {/* <div className="pay-order-line-dashed" />
            <div className="order-list">
              <Flex style={{ height: "100%" }}>
                <Flex.Item className="leftLable">订单状态</Flex.Item>
                <Flex.Item className="rightText">
                  {item.state === 1
                    ? "已接车"
                    : item.state === 2
                      ? "已完工"
                      : "已交车"}
                </Flex.Item>
              </Flex>
            </div> */}
            <div className="pay-order-line-dashed" />
            <div className="order-list">
              <button
                className="complation-button"
                onClick={() => {
                  this.props.history.push(
                    "/serveDoneBeforeOpen?consumOrderId=" +
                      item.consumOrderId +
                      "&cabinetSN=" +
                      item.cabinetSN
                  );
                }}
              >
                确认完工
              </button>
            </div>
          </div>
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

        <div style={{ marginBottom: "1rem" }}>{serving}</div>
        {/* <div className="empty-bac" style={{display:this.state.services.length < 1?'block':'none'}}></div> */}

        <TechBottomBar nowTab={1} />
      </div>
    );
  }
}

export default withRouter(Serving);
