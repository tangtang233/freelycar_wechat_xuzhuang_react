import React from 'react';
import './orderDetail.less'
import { Flex } from 'antd-mobile'
import NavBar from '../../components/NavBar'
import { wxOrderDetail } from '../../services/orders.js'
import {withRouter} from "react-router-dom";
import { payment, getWXConfig, membershipCard } from '../../services/pay.js'
import getParameterByName from '../../utils/getParam.js'
class OrderDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            clientName: '',
            licensePlate: '',
            state: '',
            totalPrice: 0,
            id: '',
            createDate: '',
            payMethod: 0,
            payState: 0,
            projects: [],

        }
    }

    componentDidMount() {
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




        wxOrderDetail({
            //wxPayOrderId: this.props.match.params.id,
            wxPayOrderId: getParameterByName('orderId')
        }).then((res) => {
            console.log(res);
            if (res.data.code == '0') {
                let data = res.data.data;
                let projects = []
                if (data.favours.length>0) {

                    for (let item of data.favours) {
                        for(let setItem of item.favour.set) {
                            setItem.times = setItem.times*item.count
                        }
                        item.count*item.favour.set
                        projects = [...projects, ...item.favour.set]
                    }
                } else if (data.service) {
                    projects = [...projects, ...data.service.projectInfos]
                }
                this.setState({
                    clientName: res.data.wxUser,
                    licensePlate: data.licensePlate,
                    totalPrice: data.totalPrice,
                    id: data.id,
                    createDate: data.createDate,
                    payMethod: data.payMethod,
                    payState: data.payState,
                    projects: projects,
                })
            }
        }).catch((error) => { console.log(error) });
    }



    handlePay = () => {
        let state = this.checkPayState();
        if (!state) {
            alert("不能发起支付");
        }

        if (state) {
            payment({//传递所需的参数
                "openId": window.localStorage.getItem('openid'),
                //"orderId": this.props.match.params.id,
                "orderId": getParameterByName('orderId'),
                "totalPrice": this.state.totalPrice,
            }).then((res) => {
                if (res.data.code == 0) {
                    let data = res.data.data;
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
                this.props.history.push('/result');
            }
        });
    }



    render() {
        //支付方式
        let payMethod = '';
        switch (this.state.payMethod) {
            case 0:
                payMethod = '现金';
                break;
            case 1:
                payMethod = '刷卡';
                break;
            case 2:
                payMethod = '支付宝';
                break;
            case 3:
                payMethod = '微信';
                break;
            case 4:
                payMethod = '易付宝';
                break;
            default:
                payMethod = '微信';
                break;
        }

        //服务项目
        const projects = this.state.projects.map((item, index) => {
            // console.log(item);
            return <Flex key={index} className='order-list'>
                <Flex.Item className='leftLable'>{item.project.name}</Flex.Item>
                <Flex.Item className='rightText'>X {item.times}</Flex.Item>
            </Flex>
        });



        return <div className="body-bac">
            <NavBar title="订单详情" />

            <Flex className="order-track-baseinfo">
                <Flex.Item className="Info">
                    <p>姓名：{this.state.clientName}{window.localStorage.getItem('isMember') ? '(会员)' : ''}</p>
                </Flex.Item>
            </Flex>
            <div className="order-track-line"></div>

            <div style={{ margin: '0 .22rem 0 .22rem', backgroundColor: '#fff' }}>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单总额</Flex.Item>
                        <Flex.Item className='rightText' style={{ color: 'red' }}>￥{this.state.totalPrice}</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单编号</Flex.Item>
                        <span style={{ paddingRight: '.42rem' }}>{this.state.id}</span>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单时间</Flex.Item>
                        <Flex.Item className='rightText'>{this.state.createDate}</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>支付方式</Flex.Item>
                        <Flex.Item className='rightText'>{payMethod}支付</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>支付状态</Flex.Item>
                        <Flex.Item className='rightText'>{this.state.payState == 0 ? '未支付' : '已支付'}</Flex.Item>
                    </Flex>
                </div>
            </div>


            <div style={{ margin: '.21rem .22rem 0.98rem .22rem', backgroundColor: '#fff'}}>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable' style={{ color: '#4b4b4b' }}>服务项目</Flex.Item>
                    </Flex>
                </div>

                <div style={{ margin: '0 .42rem 0 .52rem', border: '.005rem #f0f0f0 solid' }}></div>

                <div >
                    {projects}
                </div>
            </div>

            {this.state.payState == 0 && <div className='bottom-pay-button'>
                <Flex style={{ height: '100%' }}>
                    <Flex.Item className='lable'>合计:</Flex.Item>
                    <Flex.Item style={{ color: 'red' }}>￥{this.state.totalPrice}</Flex.Item>
                    <div className='pay-button' onClick={() => { this.handlePay() }}>
                        <Flex style={{ height: '100%' }}>
                            <Flex.Item style={{ textAlign: 'center', color: '#fff' }}>立即支付</Flex.Item>
                        </Flex>
                    </div>

                </Flex>
            </div>}


        </div>
    }
}

export default withRouter(OrderDetail);