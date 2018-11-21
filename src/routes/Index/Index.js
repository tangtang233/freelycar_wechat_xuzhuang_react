import React from 'react';
import { Flex } from 'antd-mobile'
import './index.less'
import TabBar from '../../components/TabBar.js'
import { myCar } from '../../services/user.js'
import { withRouter } from "react-router-dom";
class Index extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            car: ''
        }
    }

    componentDidMount() {
        myCar({
            clientId: window.localStorage.getItem('clientId'),
            // clientId: 268
        }).then((res) => {
            if (res.data.code == '0') {
                let data = res.data.data;
                console.log(data);

                for (let item of data) {
                    if (item.car.defaultCar) {
                        this.setState({
                            car: item.car,
                        })
                    }
                }

            }
        }).catch((error) => { console.log(error) });

        //加载swiper
        let mySwiper4 = new Swiper(this.swiperID, {
            direction: 'horizontal',
            loop: true,
            // 如果需要分页器
            speed: 2000,
            autoplay: 1500,
            pagination: '.swiper-pagination',
        });
    }



    render() {
        return <div>
            <div className="swiper-container" ref={self => this.swiperID = self}>
                <div className="swiper-wrapper">
                    <div className="swiper-slide  banner-img " ><img src={require('../../img/index_banner.jpg')} alt="" /></div>
                    <div className="swiper-slide  banner-img " ><img src={require('../../img/index_banner2.jpg')} alt="" /></div>
                    <div className="swiper-slide  banner-img " ><img src={require('../../img/index_banner3.jpg')} alt="" /></div>
                </div>
                <div className="swiper-pagination circle-color"></div>
            </div>

            <Flex direction="row" justify="center" className="index-addcar-btn" onClick={() => { if (!this.state.car) { this.props.history.push(`/addcar/2`) } else { this.props.history.push('/carInfo') } }}>
                {!this.state.car && <div className="index-addcar-icon"><img src={require('../../img/icon_car.png')} /></div>}
                {!this.state.car && <div className="index-addcar-font">添 加 爱 车 <img src={require('../../img/discount.png')} /> 不 停</div>}
                {this.state.car && <div className="index-addcar-caricon"><img src={require("../../" + (this.state.car.carMark ? "carImgs/" + this.state.car.carMark : 'img/car_icon') + ".jpg")} /></div>}
                {this.state.car && <div className="index-addcar-font">{this.state.car.licensePlate}&nbsp;&nbsp;<span style={{ fontSize: '.18rem' }}>{this.state.car.carbrand}</span></div>}
            </Flex>

            <Flex className="index-block-box" onClick={() => { this.props.history.push('/addCard') }}>
                <div className="icon-sale"><img src={require('../../img/icon_sale.png')} /></div>
                <div className="index-block-icon"><img src={require('../../img/icon_card.png')} /></div>
                <div>
                    <div style={{ fontSize: '.32rem', marginBottom: '.2rem' }}>办理会员</div>
                    <div style={{ fontSize: '.22rem' }}>多重好礼享不停！</div>
                </div>
            </Flex>

            <Flex className="index-block-box" onClick={() => { this.props.history.push(`/store-detail?storeId=1`) }}>
                <div className="index-block-icon"><img src={require('../../img/icon_shop.png')} /></div>
                <div>
                    <div style={{ fontSize: '.32rem', marginBottom: '.2rem' }}>门店优惠</div>
                    <div style={{ fontSize: '.22rem' }}>门店优惠多多</div>
                </div>
            </Flex>

            <Flex>
                <Flex style={{ marginRight: '.2rem', flex: 1 }} className="index-row-block-box" onClick={() => { this.props.history.push(`/inquiry`) }}>
                    <div className="index-block-icon">
                        <img src={require('../../img/icon_chexian.png')} />
                    </div>
                    <div>
                        车险询价
                    </div>
                </Flex>
                <Flex style={{ flex: 1 }} className="index-row-block-box" onClick={() => { window.location.href = `https://m.che300.com/freelycar` }}>
                    <div className="index-block-icon">
                        <img src={require('../../img/icon_guzhi.png')} />
                    </div>
                    <div>
                        爱车估值
                    </div>
                </Flex>
            </Flex>
            <TabBar nowTab={1} />
        </div>
    }

}

export default withRouter(Index);
