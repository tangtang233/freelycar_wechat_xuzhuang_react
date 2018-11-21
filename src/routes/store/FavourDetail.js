import React from 'react';
import NavBar from '../../components/NavBar'
import { Flex } from 'antd-mobile'
import './CooperativeStore.less'
import { storeDetail, favourDetail, Toast } from '../../services/store.js'
import { getWXConfig, favour } from '../../services/pay.js'
import {withRouter} from "react-router-dom";
import getParameterByName from '../../utils/getParam.js'
class FavourDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { set: [] },
            price: 0,
            num: 1
        }
    }

    componentDidMount() {

        getWXConfig({ "targetUrl": window.location.href }).then((res) => {
            //if (res.data.code == '0') 
            let data = res.data;
            //先注入配置JSSDK信息
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: ["getLocation", "openLocation", 'checkJsApi'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function () {
                console.log("验证微信接口成功");
            });
        }).catch((error) => {
            console.log(error)
        })

        favourDetail({ favourId: getParameterByName('id') }).then((res) => {
            console.log(res)
            if (res.data.code == '0') {
                let price = 0
                for (let item of res.data.data.set) {
                    price = price + item.buyPrice
                }
                this.setState({
                    data: res.data.data,
                    num: 1,
                    price: price
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }



    handlePay = (price) => {
        if (price == 0) {
            Toast.info('当前支付金额为0,不能支付', 2);
            return false;
        }

        let state = this.checkPayState();
        if (!state) {
            Toast.info("不能发起支付", 2);
        }

        if (state) {
            let id = this.state.data.id
            favour({//传递所需的参数
                //"openId": 'oBaSqs4THtZ-QRs1IQk-b8YKxH28',
                "openId": window.localStorage.getItem('openid'),
                "favours": [{favour:{id:id},count:this.state.num,price:this.state.price}],
                "totalPrice": price,
            }).then((res) => {
                let data = res.data.data;
          
                this.onBridgeReady(data.appId, data.timeStamp,
                    data.nonceStr, data.package,
                    data.signType, data.paySign);
            }).catch((error) => { console.log(error) });
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
                this.props.history.push('/result')
            } else {

            }
        });
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


    render() {
        let detailList = this.state.data.set.map((item, index) => {
            return <div className="list" key={index}>
                <span className="list-name">{item.project.name}</span>
                <span className="list-time"><span className="number">{item.times}</span>次</span>
            </div>
        })
        return <div className="body-bac">
            <NavBar title="优惠详情" />
            <div><img style={{ width: '100%', height: '3.57rem' }} src={ getParameterByName('id')==11?require('../../img/index_banner.jpg'):require('../../img/favour_banner.jpg')} /></div>
            <div className="card-detail-times" style={{ position: 'static' }}>
                <div className="title" >优惠明细</div>
                <div className="hr"></div>
                {detailList}
            </div>
            <div className='bottom-pay-button'>
                <Flex style={{ height: '100%' }}>
                    <Flex.Item className='lable'>合计:<span style={{ color: 'red' }}>￥{this.state.price * this.state.num}</span></Flex.Item>

                    <Flex className="use-button">
                        <Flex align="center" justify="center" className="use-button-plus" onClick={() => { if (this.state.num > 1) { this.setState({ num: this.state.num - 1 }) } }}>-</Flex>
                        <div className="number">{this.state.num}</div>
                        <Flex className="use-button-plus" align="center" justify="center" onClick={() => { this.setState({ num: this.state.num + 1 }) }}>+</Flex>
                    </Flex>
                    <div className='pay-button' onClick={() => { this.handlePay(this.state.price * this.state.num) }}>
                        <Flex style={{ height: '100%' }}>
                            <Flex.Item style={{ textAlign: 'center', color: '#fff' }}>立即支付</Flex.Item>
                        </Flex>
                    </div>
                </Flex>
            </div>
        </div>
    }
}

export default withRouter(FavourDetail);
