import React from "react";
import "./PayOrder.less";
import { Flex, Card, Picker, List, Modal, Toast } from "antd-mobile";
import NavBar from "../../components/NavBar";
import { wxOrderDetail } from "../../services/orders.js";
import { withRouter } from "react-router-dom";
import { payment, getWXConfig, membershipCard } from "../../services/pay.js";
import getParameterByName from "../../utils/getParam.js";
import img_success_pay from "../../img/success_pay.png";
import get from "../../utils/get";

const alert = Modal.alert;
class PayOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clientName: "",
      licensePlate: "",
      state: "",
      totalPrice: 0,
      id: "",
      createDate: "",
      payMethod: 0,
      payState: 0,
      projects: [],
      //   member: window.localStorage.getItem("isMember"),
      member: true,
      cards: [],
      orderInfo: {
        pickCarStaff: {},
        projects: [
          {
            name: ""
          }
        ]
      },
      paidModal: false,
      cardValue: ["-1"],
      cardBalance: null,
      cardLabel: "请选择会员卡",
      cardUseNum: null,
      cardType: 0,
      cardPay: false,
      cardTypeName: ""
    };
  }

  componentWillMount() {
    //通过后台对微信签名的验证。
    getWXConfig({
      targetUrl: window.location.href
    })
      .then(res => {
        let data = res.data;
        //先注入配置JSSDK信息
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: ["checkJsApi"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function () {
          console.log("验证微信接口成功");
        });
      })
      .catch(error => {
        console.log(error);
      });

    get("api/orders/queryById?consumOrderId=" + getParameterByName("orderId"))
      .then(res => {
        console.log("queryid", res);
        if (res.data.code == "0") {
          this.setState({
            orderInfo: res.data.data,
            cards: res.data.card
          });
          this.setState({
            cardValue: res.data.card.length > 0 ? [res.data.card[0].cardNumber] : ["-1"]
          });
          console.log('cards', this.state.cards)
          this.state.cards.map((item, index) => {
            console.log(index)
            if (index == 0) {
              var cardetail = item;

              if (cardetail.service.type === 0) {
                this.setState({
                  cardType: 0,
                  cardTypeName: "剩余次数:",
                  cardUseNum: cardetail.projectInfos[0].remaining
                });
                // cardTypeName = ;
                // this.setState({
                //   cardUseNum: item.projectInfos[0].remaining
                // });
              } else if (cardetail.service.type === 2) {
                this.setState({
                  cardType: 2,
                  cardTypeName: "余额:",
                  cardBalance: cardetail.balance
                });
                // this.setState({
                //   cardBalence: item.balance
                // });
              }
            }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });

    // wxOrderDetail({
    //     //wxPayOrderId: this.props.match.params.id,
    //     wxPayOrderId: getParameterByName('orderId')
    // }).then((res) => {
    //     console.log(res);
    //     if (res.data.code == '0') {
    //         let data = res.data.data;
    //         let projects = []
    //         if (data.favours.length > 0) {

    //             for (let item of data.favours) {
    //                 for (let setItem of item.favour.set) {
    //                     setItem.times = setItem.times * item.count
    //                 }
    //                 item.count * item.favour.set
    //                 projects = [...projects, ...item.favour.set]
    //             }
    //         } else if (data.service) {
    //             projects = [...projects, ...data.service.projectInfos]
    //         }
    //         this.setState({
    //             clientName: res.data.wxUser,
    //             licensePlate: data.licensePlate,
    //             totalPrice: data.totalPrice,
    //             id: data.id,
    //             createDate: data.createDate,
    //             payMethod: data.payMethod,
    //             payState: data.payState,
    //             projects: projects,
    //         })
    //     }
    // }).catch((error) => { console.log(error) });

  }
  handleCardPay = () => {
    get(
      "api/orders/payWithCard?orderId=" +
      getParameterByName("orderId") +
      "&cardNumber=" +
      this.state.cardValue[0]
    )
      .then(res => {
        if (res.data.code == 0) {
          Toast.success("支付成功", 2);
          this.props.history.push("myReservation");
        } else {
          Toast.fail(res.data.data, 2);
        }
        console.log("paycard", res);
      })
      .catch(error => {
        console.log(error);
      });
    console.log("卡支付");

    // console.log(this.state.cardType);
    console.log(this.state.cardValue[0]);
  };

  handlePay = () => {
    // console.log(this.state.cardType);
    console.log(this.state.cardValue[0]);
    console.log("现金支付");
    let state = this.checkPayState();
    if (!state) {
      alert("不能发起支付");
    }

    if (state) {
      payment({
        //传递所需的参数
        openId: window.localStorage.getItem("openid"),
        orderId: getParameterByName("orderId"),
        totalPrice: this.state.orderInfo.totalPrice
      })
        .then(res => {
          // 支付成功后的回调函数
          if (res.data.code == 0) {
            let data = res.data.data;
            this.onBridgeReady(
              data.appId,
              data.timeStamp,
              data.nonceStr,
              data.package,
              data.signType,
              data.paySign
            );
            get(
              "api/orders/updateOrderInfo?orderId=" +
              getParameterByName("orderId")
            ).then(res => {
              console.log(res);
              if(res.data.code == 0){
                this.props.history.push('myReservation')
              }
            });
          }else{
            Toast.fail("支付失败", 2);
          }


          // if (res.data.code == 0) {
          //     let data = res.data.data;
          //     this.onBridgeReady(data.appId, data.timeStamp,
          //         data.nonceStr, data.package,
          //         data.signType, data.paySign);
          // } else {
          //     alert('支付失败');
          // }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  checkPayState = () => {
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
      }
      return true;
    } else {
      return true;
    }
  };

  onBridgeReady = (
    appId,
    timeStamp,
    nonceStr,
    prepay_id,
    signType,
    paySign,
    type
  ) => {
    WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      {
        appId: appId, // 公众号名称，由商户传入
        timeStamp: timeStamp, // 时间戳，自1970年以来的秒数
        nonceStr: nonceStr, // 随机串
        package: prepay_id,
        signType: signType, // 微信签名方式：
        paySign: paySign
        // 微信签名
      },
      function (res) {
        console.log("支付结果:");
        console.log(res);
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          this.props.history.push("/result");
        }
      }
    );
  };

  render() {
    const onPayClick = () => {
      alert("确认支付", "请点击确定支付订单", [
        {
          text: "取消",
          onPress: () => console.log("cancel"),
          style: "default"
        },
        {
          text: "确定",
          onPress: () => {
            if (this.state.cardValue == "-1") {
              this.handlePay();
            } else {
              this.handleCardPay();
            }
          }
        }
      ]);
    };
    //支付方式
    let payMethod = "";
    switch (this.state.payMethod) {
      case 0:
        payMethod = "现金";
        break;
      case 1:
        payMethod = "刷卡";
        break;
      case 2:
        payMethod = "支付宝";
        break;
      case 3:
        payMethod = "微信";
        break;
      case 4:
        payMethod = "易付宝";
        break;
      default:
        payMethod = "微信";
        break;
    }

    var cardsArr = [];

    cardsArr.push({
      label: "不使用会员卡(微信支付)",
      value: "-1"
    });

    this.state.cards.map((item, index) => {
      console.log(item);

      cardsArr.push({
        label: item.service.name,
        value: item.cardNumber
      });
    });

    var cardvaluearr = [];
    cardvaluearr.push(cardsArr[0].value);

    var cardTypeName = "";
    // console.log(cardsArr[0].value);

    //服务项目
    const projects = this.state.projects.map((item, index) => {
      // console.log(item);
      return (
        <Flex key={index} className="order-list">
          <Flex.Item className="leftLable">{item.project.name}</Flex.Item>
          <Flex.Item className="rightText">X {item.times}</Flex.Item>
        </Flex>
      );
    });

    return (
      <div className="body-bac">
        <NavBar title="支付订单" />
        <Flex className="my-reservation-info">
          <Flex.Item className="reservation-time">
            <span>订单时间: {this.state.orderInfo.createDate}</span>
            {/* <span>订单时间: 2018-07-07 11:00</span> */}
            {/* {this.state.createDate} */}
          </Flex.Item>
          {/* <Flex.Item className="car-num">苏A88888</Flex.Item> */}
          <Flex.Item className="car-num">
            {this.state.orderInfo.licensePlate}
          </Flex.Item>
        </Flex>
        <div className="order-track-line" />
        <div style={{ margin: "0 .22rem 0 .22rem", backgroundColor: "#fff" }}>
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">订单总额</Flex.Item>
              <Flex.Item className="rightText" style={{ color: "red" }}>
                ￥{this.state.orderInfo.totalPrice}
              </Flex.Item>
            </Flex>
          </div>
          <div className="pay-order-line-dashed" />
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">订单编号</Flex.Item>
              <span style={{ paddingRight: ".42rem" }}>
                {this.state.orderInfo.id}
              </span>
            </Flex>
          </div>
          <div className="pay-order-line-dashed" />
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">服务项目</Flex.Item>
              <Flex.Item className="rightText">
                {this.state.orderInfo.projects[0].name}
                {/* 普洗 */}
              </Flex.Item>
            </Flex>
          </div>
          <div className="pay-order-line-dashed" />
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">服务人员</Flex.Item>
              <Flex.Item className="rightText">
                {this.state.orderInfo.pickCarStaff.name}
              </Flex.Item>
            </Flex>
          </div>
          <div className="pay-order-line-dashed" />
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">接单时间</Flex.Item>
              <Flex.Item className="rightText">
                {this.state.orderInfo.createDate}
              </Flex.Item>
            </Flex>
          </div>
          <div className="pay-order-line-dashed" />
          <div className="order-list">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="leftLable">完工时间</Flex.Item>
              <Flex.Item className="rightText">
                {this.state.orderInfo.finishTime}
              </Flex.Item>
            </Flex>
          </div>
        </div>
        {/* <Modal
          // className="successPaid"
          style={{ width: "6.4rem", height: "7.57rem" }}
          transparent
          maskClosable={true}
          visible={this.state.paidModal}
          // onClose={this.onClose('modal1')}
          // footer={[{ text: '确定', onPress: () => { console.log('ok'); this.onClose('modal1')(); } }]}
        >
          <div className="successPaid">
            <img className="img_success_pay" src={img_success_pay} alt="" />
            <div className="main_tip">支付成功</div>
            <div className="sub_tip">请取走您的钥匙, 然后关闭柜门</div>
          </div>
        </Modal> */}
        {/* <div style={{ margin: '.21rem .22rem 0.98rem .22rem', backgroundColor: '#fff' }}>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable' style={{ color: '#4b4b4b' }}>服务项目</Flex.Item>
                    </Flex>
                </div>

                <div style={{ margin: '0 .42rem 0 .52rem', border: '.005rem #f0f0f0 solid' }}></div>

                <div >
                    {projects}
                </div>
            </div> */}
        {this.state.member == true && (
          <div className="choose-membercard">
            {/* <div className='choose-membercard-header'> */}
            <Flex style={{ height: "0.74rem" }}>
              <Flex.Item className="choose-membercard-title">
                选择会员卡
              </Flex.Item>
            </Flex>
            <div className="pay-order-line-solid" />
            <div className="membercard-picker">
              <Flex style={{ height: "100%" }}>
                <Flex.Item>
                  <Picker
                    // className="pickCard"
                    data={cardsArr}
                    cols={1}
                    value={this.state.cardValue}
                    onChange={value => {
                      this.setState({
                        cardValue: value
                      });

                      var cardetail = {};
                      if (value == "-1") {
                        this.setState({
                          cardTypeName: "",
                          cardType: -1
                        });
                      }
                      this.state.cards.map((item, index) => {
                        if (item.cardNumber == value[0]) {
                          cardetail = item;
                          if (cardetail.service.type === 0) {
                            this.setState({
                              cardType: 0,
                              cardTypeName: "剩余次数:",
                              cardUseNum: cardetail.projectInfos[0].remaining
                            });
                            // cardTypeName = ;
                            // this.setState({
                            //   cardUseNum: item.projectInfos[0].remaining
                            // });
                          } else if (cardetail.service.type === 2) {
                            this.setState({
                              cardType: 2,
                              cardTypeName: "余额:",
                              cardBalance: cardetail.balance
                            });
                            // this.setState({
                            //   cardBalence: item.balance
                            // });
                          }
                        }
                      });
                      console.log("detail", cardetail);

                      //   this.state.cards.map((item, index) => {
                      //     if (item.cardNumber == value[0]) {
                      //       console.log("type", item.service.type);
                      //       console.log(item.cardNumber, value[0]);
                      //     //   this.setState({
                      //     //     cardType: item.service.type
                      //     //   });

                      //       if (item.service.type === 0) {
                      //         cardTypeName = "剩余次数:";
                      //         // this.setState({
                      //         //   cardUseNum: item.projectInfos[0].remaining
                      //         // });
                      //       }
                      //       else if (item.service.type === 2) {
                      //         cardTypeName = "余额:";
                      //         // this.setState({
                      //         //   cardBalence: item.balance
                      //         // });
                      //       }
                      //     } else {
                      //       cardTypeName = "";
                      //       this.setState({
                      //         cardType: -1
                      //       });
                      //     }
                      //   });
                    }}
                  >
                    <List.Item arrow="down" />
                  </Picker>
                </Flex.Item>
              </Flex>
            </div>
            <div className="balence">
              <Flex>
                <Flex.Item className="balence-value">
                  {/* {this.state.cardType == 0
                    ? "剩余次数:" + this.state.cardUseNum
                    : this.state.cardType == 2
                      ? "余额:" + this.state.cardBalence
                      : ""} */}
                  {this.state.cardTypeName}
                  <span style={{ color: "red", fontSize: "0.32rem" }}>
                    {/* {this.state.cardType==0? :'余额:'}  */}

                    {this.state.cardType == 0
                      ? this.state.cardUseNum
                      : this.state.cardType == 2
                        ? this.state.cardBalance
                        : ""}
                  </span>
                </Flex.Item>
              </Flex>
            </div>
            {/* </div> */}
          </div>
        )}

        {this.state.payState == 0 && (
          <div className="bottom-pay-button">
            <Flex style={{ height: "100%" }}>
              <Flex.Item className="lable">合计:</Flex.Item>
              <Flex.Item style={{ color: "red" }}>
                ￥{this.state.orderInfo.totalPrice}
              </Flex.Item>
              <div
                className="pay-button"
                onClick={() => {
                  onPayClick();
                }}
              >
                <Flex style={{ height: "100%" }}>
                  <Flex.Item style={{ textAlign: "center", color: "#fff" }}>
                    立即结算
                  </Flex.Item>
                </Flex>
              </div>
            </Flex>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(PayOrder);
