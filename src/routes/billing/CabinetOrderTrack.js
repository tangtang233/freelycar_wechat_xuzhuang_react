import React from 'react';
import NavBar from '../../components/NavBar'
import { Flex } from 'antd-mobile'
import './CabinetOrderTrack.less'
import { orderDetail } from '../../services/orders.js'
import parseForm from '../../utils/parseToForm.js'
import {withRouter} from "react-router-dom";
import { payment, getWXConfig, membershipCard } from '../../services/pay.js'
import { quickOrder } from '../../services/user.js'
import getParameterByName from '../../utils/getParam.js'
import img_scan_icon from '../../img/scancode_smll.png'
class CabinetOrderTrack extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            payState: 0,
            state: 4,
            projects: [],
            programName: '',
            licensePlate: '',
            clientName: '',
            deliverTime: '',
            finishTime: '',
            createDate: '',
            inventoryInfos: [],
            empty: false,
            id: getParameterByName('orderId')
        }
    }

    componentDidMount() {
        if (getParameterByName('orderId') == null) {
        }

        if (!window.localStorage.getItem('openid')) {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx89ac1808e298928d&redirect_uri=http%3a%2f%2fwww.freelycar.com%2ffreelycar_wechat%2fapi%2fuser%2fwechatlogin%3FhtmlPage%3Dordertrack%2f%24%26isAuth%3dtrue&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }
        //通过后台对微信签名的验证。
        getWXConfig({
            targetUrl: window.location.href,
        }).then((res) => {
            let data = res.data;
            //先注入配置JSSDK信息
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                console.log("验证微信接口成功");
            });

        }).catch((error) => { console.log(error) });

        if (getParameterByName('orderId') == null) {
            if (window.localStorage.getItem('openid')) {
                quickOrder({
                    clientId: window.localStorage.getItem('clientId')
                }).then((res) => {
                    console.log(res)
                    let data = res.data.orders
                    if (res.data.code == '0') {
                        console.log(data)
                        this.setState({
                            clientName: data.clientName,
                            licensePlate: data.licensePlate,
                            createDate: data.createDate,
                            deliverTime: data.deliverTime,
                            finishTime: data.finishTime,
                            programName: data.programName,
                            // state: data.state == 0 ? '已接车' : (data.state == 1 ? '已完工' : '已交车'),
                            state: data.state,
                            projects: data.projects,
                            payState: data.payState,
                            stars: data.stars,
                            inventoryInfos: data.inventoryInfos,
                            totalPrice: data.totalPrice,
                            actualPrice: data.actualPrice,
                            id: data.id
                        })
                        window.localStorage.setItem('storeName', data.store.name)
                        window.localStorage.setItem('imgUrl', data.store.imgUrls[0])
                    } else if (res.data.code == '28') {
                        this.setState({
                            empty: true
                        })
                    }
                }).catch((error) => { console.log(error) })
            }
        } else {
            orderDetail({
                consumOrderId: getParameterByName('orderId')
            }).then((res) => {
                let data = res.data.orders
                console.log(res)
                if (res.data.code == '0') {
                    console.log(data)
                    this.setState({
                        clientName: data.clientName,
                        licensePlate: data.licensePlate,
                        createDate: data.createDate,
                        deliverTime: data.deliverTime,
                        finishTime: data.finishTime,
                        programName: data.programName,
                        // state: data.state == 0 ? '已接车' : (data.state == 1 ? '已完工' : '已交车'),
                        state: data.state,
                        projects: data.projects,
                        payState: data.payState,
                        stars: data.stars,
                        inventoryInfos: data.inventoryInfos,
                        actualPrice: data.actualPrice,
                        id: data.id,
                        totalPrice: data.totalPrice
                    })
                    window.localStorage.setItem('storeName', data.store.name)
                    window.localStorage.setItem('imgUrl', data.store.imgUrls[0])
                }
            }).catch((error) => { console.log(error) })
        }

    }


    handlePay = (totalPrice) => {
        let state = this.checkPayState();
        if (!state) {
            alert("不能发起支付");
        }

        if (state) {
            payment({//传递所需的参数
                //"openId": 'oBaSqs4THtZ-QRs1IQk-b8YKxH28',
                "openId": window.localStorage.getItem('openid'),
                "orderId": this.state.id,
                "totalPrice": totalPrice,
            }).then((res) => {
                if (res.data.code == 0) {
                    let data = res.data.data;
                    console.log(data);
                    this.onBridgeReady(data.appId, data.timeStamp,
                        data.nonceStr, data.package,
                        data.signType, data.paySign);
                } else {
                    alert('支付失败');
                }
            }).catch((error) => { console.log(error) });
        }
    }


    checkPayState = () => {
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
            return true;
        } else {
            return true;
        }
    }


    onBridgeReady = (appId, timeStamp, nonceStr, prepay_id, signType,
        paySign, type) => {
        WeixinJSBridge.invoke('getBrandWCPayRequest', {
            "appId": appId, // 公众号名称，由商户传入
            "timeStamp": timeStamp, // 时间戳，自1970年以来的秒数
            "nonceStr": nonceStr, // 随机串
            "package": prepay_id,
            "signType": signType, // 微信签名方式：
            "paySign": paySign
            // 微信签名
        }, function (res) {
            console.log("支付结果:");
            console.log(res);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                window.location.href = "policy.html?type=" + type;
            }
        });
    }

    render() {
        let totalPrice = 0 //总金额

        for (let item of this.state.inventoryInfos) {
            totalPrice = totalPrice + item.number * item.inventory.price
        }

        let projectItems = this.state.projects.map((item, index) => {
            let price = item.projectInfo.presentPrice + item.projectInfo.pricePerUnit * item.projectInfo.referWorkTime
            let projectPrice = item.projectInfo.price + item.projectInfo.pricePerUnit * item.projectInfo.referWorkTime
            totalPrice = item.projectInfo.presentPrice + totalPrice
            for (let inventoryItem of this.state.inventoryInfos) {
                if (inventoryItem.projectId === item.projectInfo.projectId) {
                    projectPrice = projectPrice + inventoryItem.number * inventoryItem.inventory.price
                    price = price + inventoryItem.number * inventoryItem.inventory.price
                    console.log(projectPrice)
                }
            }

            return <Flex direction="column" justify="center" style={{ width: '100%', borderTop: '1px dashed #f0f0f0', height: '0.85rem' }} key={index} align="end" >
                <Flex style={{ width: '100%' }} >
                    <div>{item.projectInfo.name}</div>
                    <div style={{ marginLeft: 'auto' }}><span style={{ fontSize: '.24rem' }}>￥</span>{price}</div>
                </Flex>
                {/* <Flex.Item className="total-money" >
                        <p className="primary-money">
                            <span style={{ fontSize: '.08rem' }}>￥</span>200
                        <i>
                            </i>
                        </p>
                    </Flex.Item> */}
                {item.projectInfo.payMethod == '0' && <Flex className="order-track-remain" style={{ width: '100%' }}>
                    <div>
                        <p>已抵扣会员卡{item.projectInfo.cardNumber}，该项目还剩余{item.remaining}次</p>
                    </div>
                    <p style={{ marginLeft: 'auto', fontSize: '.22rem' }}>
                        <span style={{ fontSize: '.22rem' }}>￥</span>{projectPrice}
                        <i>
                        </i>
                    </p>
                </Flex>}
                {item.projectInfo.payMethod == '2' && <Flex className="order-track-remain" style={{ width: '100%' }}>
                    <div>
                        <p>已抵扣{item.projectInfo.favourName}，该项目还剩余{item.remaining}次</p>
                    </div>
                    <p style={{ marginLeft: 'auto', fontSize: '.22rem' }}>
                        <span style={{ fontSize: '.22rem' }}>￥</span>{projectPrice}
                        <i>
                        </i>
                    </p>
                </Flex>}
            </Flex>
        })


        return <div className="body-bac">
            <div className="nav-bar-title">
                <i className="back" onClick={() => { this.props.history.push(`/serviceCard`) }}></i>
                订单跟踪
            <i className="scan"></i>
            </div>
            {!this.state.empty && <div>
                <Flex className="order-track-baseinfo">
                    <Flex.Item className="Info">
                        <p>{this.state.clientName}{window.localStorage.getItem('isMember') === 'true' ? '(会员)' : ''}</p>
                        <div>{this.state.licensePlate}</div>
                    </Flex.Item>
                    <Flex.Item className="state">{this.state.state == 1 ? '已接车' : (this.state.state == 2 ? '已完工' : '已交车')}</Flex.Item>
                </Flex>
                <div className="order-track-line"></div>
                <Flex className="order-track-program" direction="column">
                    <div className="beauty special-font-size">
                        <p>{this.state.programName}</p>
                    </div>
                    <div className="ordertrack-project">{projectItems}</div>

                    <div style={{ textAlign: 'right', width: '100%', marginBottom: '.1rem' }}><div style={{ marginRight: '.42rem', display: 'inline-block' }}>{this.state.payState == 1?'实付':'合计'}：<span style={{ fontSize: '.24rem', color: '#e42f2f' }}>￥</span><span style={{ color: '#e42f2f' }}>{this.state.payState == 1 ? this.state.actualPrice : this.state.totalPrice}</span></div>
                        {/* {this.state.payState == 0 && <div className="pay-btn" onClick={() => { this.handlePay(this.state.totalPrice) }}>
                            <p>去付款</p>
                        </div>} */}
                        {this.state.payState == 0 && <div>（未结算）</div>}
                    </div>
                </Flex>

                <div className='order-list order-tarck-info'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单编号</Flex.Item>
                        <Flex.Item className='rightText'>{this.state.id}</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list order-tarck-info' style={{ marginTop: '0', borderTop: '1px dashed #f0f0f0' }}>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单时间</Flex.Item>
                        <Flex.Item className='rightText'>{this.state.createDate}</Flex.Item>
                    </Flex>
                </div>
                <div className="order-track-state">
                    <Flex className={this.state.state == 3 ? "order-track-state-box active" : "order-track-state-box"} align="start">
                        <div className="time">
                            <p>{this.state.deliverTime ? this.state.deliverTime.slice(5, 10) : ''}</p>
                            <p style={{ marginLeft: '.22rem' }}>{this.state.deliverTime ? this.state.deliverTime.slice(11, 16) : ''}</p>
                        </div>
                        <div className="right-box">
                            <div className="circle">
                            </div>
                            <div className="car-state">已交车</div>
                            {this.state.state >= 3&&this.state.stars==0&&<div>爱车已交回你的手中 快来评价获积分吧</div>}
                            {this.state.state >= 3&&this.state.stars>0&&<div>小易爱车竭诚为您服务 期待您的再次光临！</div>}
                            {this.state.state == 3 && this.state.payState > 0 && this.state.stars == 0 && <div className="evaluate" onClick={() => { this.props.history.push(`/store/comment/${this.state.id}`) }}>
                                评价得{this.state.totalPrice}积分
                        </div>}
                        </div>
                    </Flex>
                    <Flex className={this.state.state == 4 ? "order-track-state-box active2" : "order-track-state-box"} align="start">
                        <div className="time">
                            <p>{this.state.finishTime ? this.state.finishTime.slice(5, 10) : ''}</p>
                            <p style={{ marginLeft: '.22rem' }}>{this.state.finishTime ? this.state.finishTime.slice(11, 16) : ''}</p>
                        </div>
                        <div className="right-box">
                                <img className="scanicon" src={img_scan_icon} alt=""/>
                            <div className="car-state">扫一扫打开柜门，取走钥匙 >
                        </div>
                        {/* {this.state.state >= 2&&<div>您的汽车已爱护完毕，期待您的带回</div>} */}
                        </div>
                    </Flex>
                    <Flex className={this.state.state == 2 ? "order-track-state-box active" : "order-track-state-box"} align="start">
                        <div className="time">
                            <p>{this.state.finishTime ? this.state.finishTime.slice(5, 10) : ''}</p>
                            <p style={{ marginLeft: '.22rem' }}>{this.state.finishTime ? this.state.finishTime.slice(11, 16) : ''}</p>
                        </div>
                        <div className="right-box">
                            <div className="circle">
                            </div>
                            <div className="car-state">已完工
                        </div>
                        {this.state.state >= 2&&<div>您的汽车已爱护完毕，期待您的带回</div>}
                        </div>
                    </Flex>
                    <Flex className={this.state.state == 1 ? "order-track-state-box active" : "order-track-state-box"} align="start">
                        <div className="time">
                            <p>{this.state.createDate ? this.state.createDate.slice(5, 10) : ''}</p>
                            <p style={{ marginLeft: '.22rem' }}>{this.state.createDate ? this.state.createDate.slice(11, 16) : ''}</p>
                        </div>
                        <div className="right-box">
                            <div className="circle">
                            </div>
                            <div className="car-state">商家已接车
                        </div>
                            <div>汽车已入库
                        </div>
                        </div>
                    </Flex>
                    <Flex className={this.state.state == 1 ? "order-track-state-box active" : "order-track-state-box"} align="start">
                        <div className="time">
                            <p>{this.state.createDate ? this.state.createDate.slice(5, 10) : ''}</p>
                            <p style={{ marginLeft: '.22rem' }}>{this.state.createDate ? this.state.createDate.slice(11, 16) : ''}</p>
                        </div>
                        <div className="right-box last">
                            <div className="circle">
                            </div>
                            <div className="car-state">已下单
                        </div>
                            <div>
                            </div>
                        </div>
                    </Flex>
                </div>
            </div>}
            {this.state.empty && <div className="empty-bac" ></div>}
        </div>
    }
}
export default withRouter(CabinetOrderTrack);
