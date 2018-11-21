import React from "react";
import moment from "moment";
import "moment/locale/zh-cn";
import NavBar from "../../components/NavBar";
import {
  Flex,
  TextareaItem,
  DatePicker,
  List,
  Toast,
  Radio,
  Modal,
  Checkbox,
  ActivityIndicator
} from "antd-mobile";
import "./OrderBilling.less";
import img_blue from "../../img/blue.png";
import { userDetail, wxInfo, myCar } from "../../services/user.js";
import { storeDetail } from "../../services/store.js";
import get from "../../utils/get";
import post from "../../utils/post";
import protocolYes from "../../img/protocolYes.png";
import protocolNo from "../../img/protocolNo.png";

// import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
const CheckboxItem = Checkbox.CheckboxItem;
const RadioItem = Radio.RadioItem;
0;
var ids = [];
var names = [];
const zhNow = null;
var that = this;
class OrderBilling extends React.Component {
  state = {
    date: zhNow,
    car: {},
    beauty: [],
    projectsIds: [],
    projectId: 0,
    projectName: "",
    projectsNames: [],
    projects: [],
    projectModal: false,
    cars: [],
    carChangeModal: false,
    textAreaText: "",
    agreeModal: false,
    clientInfo: {
      trueName: "",
      licensePlate: ""
    },
    protocolAgree: false,
    loadingModal: false
  };
  componentWillMount() {
    const clientId = window.localStorage.getItem("clientId");
    userDetail({
      clientId: clientId
    })
      .then(res => {
        console.log("detailinfo", res);
        window.localStorage.setItem("isMember", res.data.client.isMember);
        let trueName = res.data.client.trueName;
        let carLength = res.data.client.cars.length;
        let hasName = trueName ? true : false;
        let hasCar = carLength > 0 ? true : false;

        if (!hasName && !hasCar) {
          this.props.history.push(`/personalInfo?nextPage=true`);
        } else if (!hasName && hasCar) {
          this.props.history.push(`/personalInfo?noName=true`);
        } else if (hasName && !hasCar) {
          this.props.history.push(`/addcar/0?noCar=true`);
        }
        get("api/reservation/loadTheBookingOrder?clientId=" + clientId).then(
          res => {
            console.log("用户有单子吗", res);
            if (res.data) {
              if (res.data.code == 0) {
                if (res.data.data.projects.length > 0) {
                  this.props.history.push(`/myReservation`);
                }
              }
            }
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentDidMount() {
    const clientId = window.localStorage.getItem("clientId");
    userDetail({
      clientId: clientId
    })
      .then(res => {
        console.log("detailinfo", res);
        let trueName = res.data.client.trueName;
        // let carLength = res.data.client.cars.length
        this.setState({
          clientInfo: {
            trueName: res.data.client.trueName
          }
        });
      })
      .catch(error => {
        console.log(error);
      });

    get("api/reservation/listProjectOnSale").then(res => {
      if (res.data.code == "0") {
        if (res.data.data) {
          this.setState({
            projects: res.data.data
          });
          // console.log("项目列表", this.state.projects);
        }
      }
    });

    // get("api/user/detail?clientId=2233").then(res => {
    //   if (res.data.code == "0") {
    //     if (res.data.client) {
    //      let data = res.data.client;
    //      console.log('dataaa',data)
    //       // this.setState({
    //       //   projects: res.data.data
    //       // });
    //     }
    //   }
    // });

    // wxInfo({
    //   openId: window.localStorage.getItem("openid")
    // })
    //   .then(res => {
    //     if (res.data.code == "0") {
    //       let data = res.data.data;
    //       this.setState({
    //         point: data.point,
    //         nickName: data.wxUser.nickName,
    //         name: data.wxUser.name,
    //         headimgurl: data.wxUser.headimgurl,
    //         phone: data.wxUser.phone,
    //         birthday: data.wxUser.birthday
    //           ? data.wxUser.birthday.slice(0, 10)
    //           : "",
    //         gender: [data.wxUser.gender]
    //       });
    //     }

    //     console.log('data222',data);

    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });

    myCar({
      clientId: window.localStorage.getItem("clientId")
      // clientId: 268
    })
      .then(res => {
        if (res.data.code == "0") {
          let data = res.data.data;
          // console.log(data)
          this.setState({
            cars: data
          });
          for (let item of data) {
            if (item.car.defaultCar) {
              this.setState({
                car: item.car
              });
            }
          }
        }
      })
      .catch(error => {
        console.log(error);
      });

    storeDetail({ storeId: 1 })
      .then(res => {
        console.log(res);
        if (res.data.code == "0") {
          let store = res.data.data.store;
          this.setState({
            // name: store.name,
            // address: store.address,
            // imgs: store.imgUrls,
            // phone: store.phone,
            // star: res.data.data.star,
            // closingTime: store.closingTime,
            // openingTime: store.openingTime,
            beauty: res.data.data.beauty
            // fix: res.data.data.fix,
            // storefavours: store.storefavours,
            // latitude: store.latitude, // 纬度，浮点数，范围为90 ~ -90
            // longitude: store.longitude, // 经度，浮点数，范围为180 ~ -180。
          });
          // let mySwiper2 = new Swiper(this.swiperID2, {
          //     direction: 'horizontal',
          //     loop: false,
          //     slidesPerView: 1.2,
          //     setWrapperSize: true,
          //     spaceBetween: 10,
          //     slidesOffsetBefore: 11,
          //     slidesOffsetAfter: 10,
          // })

          // let mySwiper1 = new Swiper(this.swiperID, {
          //     direction: 'horizontal',
          //     loop: true,
          //     // 如果需要分页器
          //     pagination: '.swiper-pagination',
          // });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  onChange = date => {
    // console.log('onChange', date);
    this.setState({
      date
    });
  };
  onCarChange = i => {
    this.setState({
      car: i.car,
      carChangeModal: false
    });
  };
  onProjectSelChange = i => {
    if (ids.indexOf(i.id) > -1) {
      ids.splice(ids.indexOf(i.id), 1);
    } else {
      ids.push(i.id);
    }
    if (names.indexOf(i.name) > -1) {
      names.splice(names.indexOf(i.name), 1);
    } else {
      names.push(i.name);
    }
    let idsData = ids.join(",");
    let namesData = names.join(",");
    this.setState({
      projectsIds: idsData,
      projectsNames: namesData
    });
    console.log(ids);
    console.log(names);

    // this.setState({
    //   projectsIds: this.state.projectsIds.indexOf(i.id) > -1 ? this.state.projectsIds.splice(this.state.projectsIds.indexOf(i.id),1) : this.state.projectsIds.push(i.id),
    //   projectsNames: this.state.projectsNames.indexOf(i.name) > -1 ? this.state.projectsNames.splice(this.state.projectsNames.indexOf(i.name),1) : this.state.projectsNames.push(i.name),
    // })

    // console.log(this.state.projectsIds.indexOf(i.id))
    // console.log(this.state.projectsNames)
  };

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

  onDateChange = date => {
    console.log("onChange", date);
    this.setState({
      date
    });
  };

  updateInfo() {
    let data = {
      clientId: window.localStorage.getItem("clientId"),
      licensePlate: this.state.car.licensePlate,
      name: this.state.clientInfo.trueName,
      // serviceIds: this.state.projectsIds,
      // services: this.state.projectsNames,
      serviceIds: this.state.projectId.toString(),
      services: this.state.projectName,
      pickUpTime:
        this.state.date == null
          ? null
          : this.state.date.format("YYYY-MM-DD HH:MM:SS"),
      cabinetSN: window.localStorage.getItem("cabinetSN"),

      location: this.state.textAreaText,
      openId: window.localStorage.getItem("openid")
    };

    console.log(data);
    post("api/reservation/add", data)
      .then(res => {
        this.onClose("loadingModal");
        if (res.data) {
          if (res.data.code == "0") {
            this.props.history.push("reservationSuccess");
          } else {
            Toast.fail(res.data.msg, 3);
            this.setState({
              loadingModal: false
            });
          }
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    // const PlaceHolder = ({ className = '', ...restProps }) => (
    // <div className={`${className} placeholder`} {...restProps}>Block</div>
    //   );
    // const { getFieldProps} = this.props;
    const data = [
      "欢迎您使用小易智能柜（以下简称“小易”）软件及服务！\n",
      "1.重要须知\n",
      "1.1为更好使用服务，您应当认真阅读并遵守《小易智能柜使用协议》（以下简称“本协议”），请您务必谨慎阅读、充分理解各条款内容。\n",
      "1.2除非您已阅读并接受本协议所有条款，否则您无权使用本软件及相关服务。您的使用、获取微信账号信息、登录等行为即视为您已阅读并同意上述协议的约束。\n",
      "1.3如果您未满18周岁，请您务必在您的监护人仔细阅读本协议并同意的前提下使用我们的产品或服务或向我们提供信息；如您违反法律法规或本协议内容使用小易产品或服务，造成的一切后果由您及您的监护人承担。\n",
      "1.4小易有权对本协议进行修订，且无须单独事先通知您。本协议一旦发生变动，小易将会在小易产品或服务和/或相关网站上公布修订后的本协议。您理解并同意，修订后的本协议具有溯及力，如果您在本协议修订版本公布后继续使用小易产品或服务的，即视为您同意修订后的本协议。\n",
      "2.个人信息及安全\n",
      "为了能够向您提供服务、客户帮助，并向您和其他用户提供更具针对性的、更好的服务，我们向您收集有关您本人以及您使用服务情况的各类信息，包括个人信息和非个人信息。使用服务，代表您同意允许我们收集、展示、分享、储存及使用这些信息。\n",
      "“个人信息”是指涉及您个人身份或个人隐私的信息，比如，您的真实姓名、手机号码、手机设备识别码、IP地址。“个人隐私信息”是指您的密码以及依法禁止我们披露的其他信息。“非个人信息”是指您的使用历史记录（如您的账户状态）以及个人信息范围外的其他普通信息。\n",
      "2.1保护您的个人信息是小易智能柜的一项基本原则，小易将会采取合理的措施保护您的个人信息。除法律法规规定的情形或事先获得您的同意外，小易未经用户许可不会向第三方公开、透露用户的个人信息。小易会尽力采取适合的安全保护措施，保护您个人信息的安全可控。\n",
      "2.2未经您的同意，小易不会向小易以外的任何公司、组织和个人披露您的个人信息，法律法规另有规定的除外。\n",
      "2.3小易提醒您注意，切勿在小易服务中公布或向不信任第三方披露自己的各类财产账户、银行卡、信用卡、第三方支付账户及对应密码等重要资料，否则由此带来的任何损失由用户自行承担。\n",
      "2.4您在使用小易产品及服务时，须自行承担如下来自小易不可控的风险内容，包括但不限于：\n",
      "2.4.1由于不可抗拒因素可能引起的个人信息丢失、泄露等风险；\n",
      "2.4.2用户使用过程中由于您将密码告知他人或与他人共享注册账号，由此导致的任何个人信息的泄露；\n",
      "2.4.3本产品根据法律规定或相关政府、司法机关的要求提供您的个人信息。\n",
      "3.主权利义务条款\n",
      "3.1账号使用规范\n",
      "3.1.1用户在使用本服务前需要同意获得微信授权，并通过手机号注册一个小易账号，一个手机号仅对应一个小易账号；\n",
      "3.1.2用户有责任妥善保管注册账户信息及账户密码的安全，用户需要对注册账户以及密码下的行为承担法律责任。您同意在任何情况下不向他人透露账户及密码信息。当在您怀疑他人在使用您的账号时，您应立即通知小易公司；\n",
      "3.1.3用户注册小易账号后如果长期不使用该帐号，小易有权回收该账号及其他所有信息，以免造成资源浪费，由此带来的任何损失均由用户自行承担；\n",
      "3.1.4用户不得冒充他人、不得利用他人的名义传播任何信息，否则本产品有权立即停止提供服务，收回小易账号并由用户独自承担由此产生的一切法律责任。\n",
      "3.2用户使用条款\n",
      "3.2.1为了给用户提供有效的服务，小易会利用您终端设备的处理器和宽带等资源，在使用小易的过程中可能会产生数据流量的费用，您需自行向运营商了解相关资费信息，并自行承担相关费用；\n",
      "3.2.2小易智能柜账号的所有权归本产品所有，用户完成申请注册手续后，仅获得小易账号的使用权，且该使用权仅属于初始申请注册人。同时，初始申请注册人不得赠与、借用、租用、转让或售卖小易账号或者以其他方式许可非初始申请注册人使用小易账号。非初始申请注册人不得通过受赠、继承、承租、受让或者其他任何方式使用小易账号。\n",
      "3.2.3用户不得在使用本服务过程中，制作、复制、发布、传播、存储违反国家法律法规禁止的内容：\n",
      "1）散布谣言，扰乱社会秩序，破坏社会稳定的；\n",
      "2）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；\n",
      "3）侮辱或者诽谤他人，侵害他人合法权益的；\n",
      "4）含有法律、行政法规禁止的其他内容。\n",
      "3.2.4用户在使用本产品服务时，本产品可能会调用第三方系统或者通过第三方支持用户的使用或访问，使用或访问的结果由该第三方提供，小易不保证通过第三方提供服务及内容的安全性、准确性、有效性及其他不确定的风险，由此若引发的任何争议及损害，与小易无关，小易不承担任何责任。\n",
      "3.3产品使用规范\n",
      "3.3.1除非法律允许或小易书面许可，您使用本产品服务过程中不得从事下列行为：\n",
      "1）对本软件产品进行反向工程、反向汇编、反向编译，或者以其他方式尝试发现本软件产品的源代码；\n",
      "2） 对本软件产品或者本软件产品运行过程中释放到任何终端内存中的数据、软件运行过程中客户端与服务器端的交互数据，以及本软件产品运行所必需的系统数据，进行复制、修改、增加、删除、挂接运行或创作任何衍生作品，形式包括但不限于使用插件、外挂或非小易经授权的第三方工具/服务接入本软件和相关系统；\n",
      "3）自行或者授权他人、第三方软件对本软件产品及其组件、模块、数据进行干扰。\n",
      "3.3.2您理解并同意，基于用户体验、相关服务平台运营安全、平台规则要求及健康发展等综合因素，小易有权选择提供服务的对象，有权决定功能设置，有权决定功能开发、数据接口和相关数据披露的对象和范围。针对以下情况，有权视具体情况中止或终止提供本服务，包括但不限于：\n",
      "1）违反法律法规或本协议规定的；\n",
      "2）影响服务体验的；\n",
      "3）存在安全隐患的；\n",
      "4）违背小易及其服务平台运营原则，或不符合小易其他管理要求的。\n",
      "3.4对自己的行为负责\n",
      "您充分了解并同意，您应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。小易无法且不会对因前述风险而导致的任何损失或损害承担责任。\n",
      "3.5违约处理\n",
      "3.5.1一旦小易发现或收到他人举报或投诉用户违反本协议约定的，小易有权不经过通知随时对相关内容进行删除、屏蔽，并视行为情节对违规账号处以包括但不限于警告、限制或禁止使用部分或全部功能、账号封禁直至注销的处罚，并公告处理结果。\n",
      "3.5.2您理解并同意，小易有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息向有关部门报告等，用户应独自承担由此而产生的一切法律责任。\n",
      "3.5.3您理解并同意，因您违反本协议或相关服务条款的规定，导致或产生第三方主张的任何索赔、要求或损失，您应当独立承担责任；小易因此遭受损失的，您也应当一并赔偿。\n",
      "4.终端安全责任\n",
      "4.1您理解并同意，本软件同大多数互联网软件一样，可能会受多种因素影响，包括但不限于用户原因、网络服务质量、社会环境等；也可能会受各种安全问题的侵扰，包括但不限于他人非法利用用户资料，进行现实中的骚扰；用户下载安装的其他软件或访问的其他网站中可能含有病毒、木马程序或其他恶意程序，威胁您的终端设备信息和数据安全，继而影响本软件的正常使用等。因此，您应加强信息安全及个人信息的保护意识，注意密码保护，以免遭受损失。\n",
      "4.2您不得制作、发布、使用、传播用于窃取小易账号及他人个人信息、财产的恶意程序。\n",
      "4.3维护软件安全与正常使用是小易和您的共同责任，小易将按照行业标准合理审慎地采取必要技术措施保护您的终端设备信息和数据安全，但是您承认和同意小易并不能就此提供完全保证。\n",
      "5.其他\n",
      "您使用本软件产品即视为您已阅读并同意受本协议的约束。小易有权在必要时修改本协议条款。您可以在本软件的最新版本中查阅相关协议条款。本协议条款变更后，如果您继续使用本软件，即视为您已接受修改后的协议。如果您不接受修改后的协议，应当停止使用本软件。"
    ];
    const title = "小易智能柜使用协议";
    let beautyList = this.state.beauty.map((item, index) => {
      return (
        <Flex key={index} className="kinds1">
          <span
            style={{
              font: "0.26rem 黑体",
              color: "#1e1e1e",
              marginLeft: "0.3rem",
              marginRight: "0.1rem"
            }}
          >
            {item.name}
          </span>
          <span style={{ fontSize: "12px", color: "red" }}>￥</span>
          <span
            style={{
              font: "0.4rem 黑体",
              color: "red",
              margin: "0 0.15rem 0 0.02rem"
            }}
          >
            {item.price}
          </span>
          {/* <img className="no-logo" style={{ width: '0.3rem', height: '0.3rem' }}src={require('../../img/no.png')} /> */}
        </Flex>
      );
    });

    return (
      <div className="body-bac">
        <NavBar title="预约开单" />
        <Flex className="billing-block-box1">
          <div
            style={{
              font: "0.32rem 黑体",
              color: "#1e1e1e",
              marginRight: "2.5rem"
            }}
          >
            {this.state.clientInfo.trueName}
            {window.localStorage.getItem("isMember") === "true" ? "(会员)" : ""}
          </div>
          <div>
            <span style={{ font: "0.26rem 黑体", color: "#1e1e1e" }}>
              {this.state.car.licensePlate}
            </span>
            <img
              className="change-icon"
              src={require("../../img/change.png")}
            />
            <span
              style={{ font: "0.26rem 黑体", color: "#8e8e8e" }}
              onClick={this.showModal("carChangeModal")}
            >
              {" "}
              切换
            </span>
            <Modal
              title="请选择车辆"
              transparent
              // maskClosable={true}
              visible={this.state.carChangeModal}
              onClose={this.onClose("carChangeModal")}
            >
              {this.state.cars.map((i, index) => (
                <RadioItem
                  key={index}
                  checked={i.car.licensePlate === this.state.car.licensePlate}
                  onChange={() => this.onCarChange(i)}
                >
                  <Flex.Item style={{ flex: 2, fontSize: ".3rem" }}>
                    {/* <span style={{ fontSize: ".2rem", marginRight: ".3rem" }}> */}
                    {i.car.carbrand}
                  </Flex.Item>
                  <Flex.Item style={{ flex: 1, fontSize: ".3rem" }}>
                    {/* </span> */}
                    <span style={{ fontSize: ".3rem", color: "red" }}>
                      {i.car.licensePlate}
                    </span>
                  </Flex.Item>
                </RadioItem>
              ))}
            </Modal>
          </div>
        </Flex>
        <div className="billing-block-box2">
          <div
            style={{
              font: "0.26rem 黑体",
              color: "#1e1e1e",
              paddingTop: "0.2rem"
            }}
            onClick={this.showModal("projectModal")}
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
              选择您本次要预约的项目
            </span>
            <span />
          </div>
          <Modal
            // style={{height:'rem',overflow:'scroll'}}
            title="请选择项目"
            transparent
            maskClosable={true}
            visible={this.state.projectModal}
            onClose={this.onClose("projectModal")}
            footer={[
              // {
              //   text: "取消",
              //   onPress: () => {
              //     console.log("cancel");
              //     this.onClose("projectModal")();
              //   }
              // },
              {
                text: "确定",
                onPress: () => {
                  this.onClose("projectModal")();
                }
              }
            ]}
          >
            {this.state.projects.map((i, index) => (
              // <CheckboxItem
              //   key={i.id}
              //   // defaultChecked={this.state.projectsIds.indexOf(i.id) > -1?true:false}
              //   onChange={() => this.onProjectSelChange(i)}
              // >
              //   <Flex>
              //     <Flex.Item style={{ flex: "2.5", fontSize: ".25rem" }}>
              //       {i.name}
              //     </Flex.Item>
              //     <Flex.Item style={{ flex: "1", color: "red" }}>
              //       ￥{i.price}
              //     </Flex.Item>
              //   </Flex>
              //   {/* <span style={{fontSize:'.26rem'}}>{i.name}</span><span style={{color:'red',textAlign:'right'}}>￥{i.price}</span> */}
              // </CheckboxItem>
              <RadioItem
                key={i.id}
                checked={this.state.projectId == i.id}
                defaultChecked={index == 0 ? true : false}
                onChange={() => {
                  console.log(i);
                  // let idsData = i.id.join(",");
                  // let namesData = i.name.join(",");
                  this.setState({
                    projectId: i.id,
                    projectName: i.name
                    // projectsIds: i.id.toString(),
                    // projectsNames: i.name
                  });
                }}
              >
                <Flex>
                  <Flex.Item style={{ flex: 2, fontSize: ".3rem" }}>
                    {i.name}
                  </Flex.Item>
                  <Flex.Item
                    style={{ flex: 1, color: "red", fontSize: ".3rem" }}
                  >
                    <span style={{ paddingLeft: "0rem" }}>￥{i.price}</span>
                  </Flex.Item>
                </Flex>
              </RadioItem>
            ))}
            {/* 这是内容...<br />
          这是内容...<br /> */}
          </Modal>
          {/* <Flex className="kinds-box"> */}
          {/* <Flex className="kinds1"><span style={{ font: '0.26rem 黑体', color: '#1e1e1e', marginLeft: '0.3rem', marginRight: '0.1rem' }} >普洗</span><span style={{ fontSize: '12px', color: 'red' }}>￥</span><span style={{ font: '0.4rem 黑体', color: 'red', margin: '0 0.15rem 0 0.02rem' }}>30</span><img className="yes-logo" style={{ width: '0.3rem', height: '0.3rem' }}src={require('../../img/yes.png')} /></Flex>
                  <Flex className="kinds2" ><span style={{ font: '0.26rem 黑体', color: '#1e1e1e', marginLeft: '0.3rem', marginRight: '0.1rem' }} >精洗</span><span style={{ fontSize: '12px', color: 'red' }}>￥</span><span style={{ font: '0.4rem 黑体', color: 'red', margin: '0 0.15rem 0 0.02rem' }}>80</span><img className="no-logo" style={{ width: '0.3rem', height: '0.3rem' }}src={require('../../img/no.png')} /></Flex>
                  <Flex className="kinds3"><span style={{ font: '0.26rem 黑体', color: '#1e1e1e', marginLeft: '0.3rem', marginRight: '0.1rem' }} >打蜡(3M)</span><span style={{ fontSize: '12px', color: 'red' }}>￥</span><span style={{ font: '0.4rem 黑体', color: 'red', margin: '0 0.15rem 0 0.02rem' }}>120</span><img className="no-logo" style={{ width: '0.3rem', height: '0.3rem' }}src={require('../../img/no.png')} /></Flex> */}
          {/* {beautyList} */}
          {/* </Flex> */}
          <div className="line-dashed" />
          <div className="choosed yi">已选择:</div>
          <div className="choosed">{this.state.projectName}</div>
          {/* {names.map((i, index) => (
            <div key={index} className="choosed">
              {i}
            </div>
          ))} */}

          {/* <div className="choosed">精致无痕洗车(小车)</div>
          <div className="choosed">精致无痕洗车(大车)</div>
          <div className="choosed">精致打蜡</div> */}
        </div>
        <Flex className="billing-block-box3">
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
        <div className="billing-block-box4-outer">
          <TextareaItem
            className="billing-block-box4"
            placeholder="请尽量详细地填写，方便我们服务人员寻找，好尽快为您服务。
                              如：金奥费尔蒙停车场负二层F12"
            // style={{height:'2rem', textAlign:'top'}}
            rows="3"
            value={this.state.textAreaText}
            onChange={e => {
              this.setState({
                textAreaText: e
              });
            }}
          />
        </div>
        <Flex className="billing-block-box5">
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
              您大约什么时间需要使用车辆？
            </span>
          </div>
        </Flex>
        {/* <Flex className="billing-block-box5" style={{marginTop:'0.04rem', marginLeft:'0.2rem',
              marginRight:'0.2rem'}}>
                      <List >
                      <DatePicker className="forss"
                          mode="datetime"
                          onChange={this.onChange}
                          value={this.state.date}
                      >
                          <List.Item arrow="horizontal"><img className='time-icon'
                          src={require('../../img/time.png')} /></List.Item>
                      </DatePicker>
                      </List>
                  </Flex>  */}
        <List className="date-picker-list">
          <DatePicker
            className="forss"
            // mode="datetime"
            onChange={this.onDateChange}
            value={this.state.date}
          >
            <List.Item arrow="horizontal">
              <img
                style={{
                  marginLeft: "0.1rem",
                  width: "0.25rem",
                  height: "0.3rem"
                }}
                className="time-icon"
                src={require("../../img/time.png")}
              />
            </List.Item>
          </DatePicker>
        </List>
        <Modal
          style={{ width: "84%", height: "70%" }}
          transparent
          maskClosable={true}
          visible={this.state.agreeModal}
          onClose={this.onClose("agreeModal")}
          footer={[
            {
              text: "确定",
              onPress: () => {
                this.onClose("agreeModal")();
              }
            }
          ]}
        >
          <div className="agreement-box">
            <div className="agreement-title">
              <span>{title}</span>
            </div>
            <div className="agreement-content">
              {data.map((item, index) => {
                return <p key={index}>{item}</p>;
              })}
            </div>
          </div>
        </Modal>
        <Modal
          title="正在打开柜门， 请在柜门打开后放入钥匙。"
          transparent
          maskClosable={false}
          visible={this.state.loadingModal}
          onClose={this.onClose("loadingModal")}
        >
          <ActivityIndicator size="large" />
        </Modal>
        <div className="billing-block-box6">
          <span style={{ color: "#a0a0a0" }}>
            {" "}
            <img
              onClick={() => {
                this.setState({
                  protocolAgree: !this.state.protocolAgree
                });
              }}
              className="pane-icon"
              src={this.state.protocolAgree ? protocolYes : protocolNo}
              style={{ paddingRight: "0.11rem" }}
            />
            同意
          </span>
          <span
            style={{ color: "#5a88e5" }}
            onClick={() => {
              this.setState({
                agreeModal: true
              });
            }}
          >
            《小易智能柜使用协议》
          </span>
        </div>
        <div
          className={
            this.state.protocolAgree ? "submit-btn" : "submit-btn-disable"
          }
          onClick={e => {
            // window.localStorage.setItem("isInfoSaved", true);
            // console.log(window.localStorage.getItem("isInfoSaved"));
            if (!this.state.protocolAgree) {
              e.preventDefault;
            } else {
              let str = "";
              if (
                // this.state.projectsIds.length < 1 &&
                this.state.projectId == 0 &&
                this.state.textAreaText == ""
              ) {
                str = "请选择服务项目,并填写停车地点";
                e.preventDefault;
                Toast.fail(str, 2);
              } else if (this.state.projectId == 0) {
                // (this.state.projectsIds.length < 1)
                str = "请选择服务项目";
                e.preventDefault;
                Toast.fail(str, 2);
              } else if (this.state.textAreaText == "") {
                str = "请填写停车地点";
                e.preventDefault;
                Toast.fail(str, 2);
              } else {
                // console.log("哈哈问问大大大");
                this.updateInfo();
                this.setState({
                  loadingModal: true
                });
              }
              // if (
              //   // this.state.projectsIds.length < 1 ||
              //   this.state.projectId==0 ||
              //   this.state.textAreaText == ""
              // ) {
              //   e.preventDefault;
              //   Toast.fail(str, 2);

              // }
              // this.updateInfo();
            }
          }}
        >
          确认提交
        </div>
      </div>
    );
  }
}

export default OrderBilling;
