import React from 'react'
import { Flex, Toast } from 'antd-mobile'
import './addCard.less'
import NavBar from '../../components/NavBar'
import cika from '../../img/cika.png'
import zhizun from '../../img/zhizun.png'
import jinka from '../../img/jinka.png'
import times_card from '../../img/times_card.png'
import service, { getCardList } from '../../services/service.js'
import { payment, getWXConfig, membershipCard } from '../../services/pay.js'
import { withRouter } from "react-router-dom";


class AddCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            services: [],
            totalPrice: 0,//选中的卡的totalprice
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



        getCardList({
            page: 1,
            number: 22
        }).then((res) => {
            //console.log(res);
            if (res.data.code == '0') {
                //初始化得到次卡的id 因为页面上次卡是第一个
                //如果不存在 id = -1

                let totalPrice = 0;
                let cards = res.data.data;
                this.setState({
                    services: cards,
                    totalPrice: totalPrice
                }, () => {
                    this.mySwiper1 = new Swiper(this.swiperID1, {
                        pagination: '.pagination',
                        paginationClickable: true,
                        centeredSlides: true,
                        slidesPerView: 2,
                        initialSlide: 1,
                        watchActiveIndex: true,
                        onSlideChangeStart: (swiper) => {
                            this.setState({
                                activeIndex: swiper.activeIndex
                            })
                        }
                    });
                    this.mySwiper2 = new Swiper(this.swiperID2, {
                        direction: 'horizontal',
                        centeredSlides: true,
                        normalizeSlideIndex: false,
                        initialSlide: 1
                        // 如果需要分页器
                    });
                    this.mySwiper1.params.control = this.mySwiper2;//需要在Swiper2初始化后，Swiper1控制Swiper2
                    this.mySwiper2.params.control = this.mySwiper1;//需要在Swiper1初始化后，Swiper2控制Swiper1
                })

            }
        }).catch((error) => { console.log(error) });
    }


    handlePay = (totalPrice, serviceId) => {
        let state = this.checkPayState();
        if (!state) {
            Toast.error('不能发起支付，请联系客服');
        }
        console.log(totalPrice,serviceId)
        if (state) {
            membershipCard({//传递所需的参数
                //"openId": 'oBaSqs4THtZ-QRs1IQk-b8YKxH28',
                "openId": window.localStorage.getItem('openid'),
                "serviceId": serviceId,
                "totalPrice": totalPrice,
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
                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
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
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                this.props.history.push('/result')
            }
        });
    }

    render() {
        let totalPrice = 0, serviceId = ''
        let cardList = this.state.services.map((item, index) => {
            let background = cika;
            switch (item.type) {
                case 0: background = cika; break;//次卡
                case 1: background = jinka; break;//组合卡
                case 2: background = zhizun; break;//储值卡
            }
            if (this.state.activeIndex == index) {
                totalPrice = item.price;
                serviceId = item.id;
            }
            return <div key={index} className="swiper-slide card-item" style={{ backgroundImage: `url(${background}) `, backgroundSize: '100% 100%',position: 'relative' }} onClick={() => { this.onHanleArrowDisplay(item.name, index) }}>
                <div className='label'>{item.name}</div>
              <div className='label-right' style={{position:'absolute',bottom:10,right:10,fontSize:10}}>有效期:{item.validTime}年</div>
            </div>
        });

        let serviceItems = this.state.services.map((item, index) => {
            let proInfos = item.projectInfos || [];
            let favInfos = item.favourInfos || [];
            let item_project = proInfos.map((item1, index1) => {
                return <div key={index + '' + index1} className='vip-service-item'>
                    <div className='label-left'>{item1.project.name}</div>
                    <div className='label-right'>
                        <span className='count'>{item1.times}</span>
                        <span className='unit'>次</span>
                    </div>
                </div>
            }) || '';
            let item_ticket = favInfos.map((item1, index1) => {
                return <div key={index + 'ticket' + index1} className='vip-service-item'>
                    <div className='label-left'>{item1.favour.name}</div>
                    <div className='label-right'>
                        <span className='count'>{item1.count}</span>
                        <span className='unit'>次</span>
                    </div>
                </div>
            }) || '';
            return <div className="swiper-slide vip-info" key={item.id}>
                <div className={`vip-service-header${item.type}`}>会员专项</div>
                {item_project}
                {item_ticket}
                {item.type == 2 && <div className='vip-service-item'>
                    <div className='label-left'>卡面值</div>
                    <div className='label-right'>
                        <span className='count'>{item.actualPrice}</span>
                        <span className='unit'>元</span>
                    </div>
                </div>}
            </div>
        })


        return (<div className="body-bac">
            <NavBar title={'会员卡添加'}></NavBar>
            <div className="swiper-container" ref={self => this.swiperID1 = self}>
                <div className="swiper-wrapper all-card-list">
                    {cardList}
                </div>
                <div className="pagination"></div>
            </div>
            <div className='swiper-container' ref={self => this.swiperID2 = self}>
                <div className="swiper-wrapper vip-service-div">
                    {serviceItems}
                </div>
            </div>
            <div className='bottom-pay-button'>
                <Flex style={{ height: '100%' }}>
                    <Flex.Item className='lable'>合计:</Flex.Item>
                    <Flex.Item style={{ color: 'red' }}><span style={{ fontSize: '12px' }}>￥</span><span style={{ fontSize: '16px' }}>{totalPrice}</span></Flex.Item>
                    <div className='pay-button'>
                        <Flex style={{ height: '100%' }}>
                            <Flex.Item style={{ textAlign: 'center', color: '#fff' }} onClick={() => { this.handlePay(totalPrice, serviceId) }}>立即支付</Flex.Item>
                        </Flex>
                    </div>
                </Flex>
            </div>
        </div>
        );
    }
}

export default withRouter(AddCard);
