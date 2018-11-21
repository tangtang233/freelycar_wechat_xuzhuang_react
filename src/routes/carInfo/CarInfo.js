import React from 'react';
import './CarInfo.less'
import { List, InputItem, WhiteSpace, Picker, Flex, Icon, Switch, DatePicker, Popover } from 'antd-mobile'
import { createForm } from 'rc-form'
import NavBar from '../../components/NavBar'
import car_icon from '../../img/car_icon.jpg'
import insurance from '../../img/insurance.png'
import annualInspection from '../../img/annualInspection.png'
import more_arrow from '../../img/more_arrow.png'
import { myCar, defaultCar, annualCheck, delCar, annualSwitch, insuranceSwitch } from '../../services/user.js'
import {withRouter} from "react-router-dom";
let Item = List.Item
class CarInfo extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            insuranceSwitch: false,//保险提醒开关
            insuranceTip: false,//保险tip
            annualInspection: false,//年检开关
            inspectionTip: false,//年检tip
            cars: [],
            inspectionTime: '',//年检提醒
            currentIndex: 0,//当前索引
            mode: '',
            visible: false
        }
    }

    componentDidMount() {
        myCar({
            clientId: window.localStorage.getItem('clientId'),
        }).then((res) => {
            if (res.data.code == '0') {
                let data = res.data.data;
                console.log(data);
                this.setState({
                    cars: data,
                })
                //加载swiper
                let mySwiper = new Swiper(this.swiperID, {
                    direction: 'horizontal',
                    loop: false,
                    slidesPerView: 1.2,
                    initialSlide: 0,
                    slideToClickedSlide: true,
                    grabCursor: true,
                    slidesPerGroup: 1,
                    spaceBetween: 5,
                    centeredSlides: false,
                    onSlideChangeEnd: (swiper) => {
                        this.setState({
                            currentIndex: swiper.activeIndex
                        });
                    }
                    // 如果需要分页器
                });
            }
        }).catch((error) => { console.log(error) });
    }


    setDefaultIndex = (id, index) => {
        defaultCar({
            carId: id
        }).then((res) => {
            let cars = this.state.cars;
            for (let i = 0; i < cars.length; i++) {
                if (i == index) {
                    cars[index].car.defaultCar = true;
                } else {
                    cars[i].car.defaultCar = false;
                }
            }
            this.setState({
                cars: cars
            });

        }).catch((error) => { console.log(error) });
    }

    delCar = (id) => {
        delCar({
            carId: id
        }).then((res) => {
            console.log(res)
            if (res.data.code == '0') {
                this.setState({
                    mode: ''
                })
            }
        })
    }

    //处理保险提醒
    OnHanleinsurance = (checked) => {
        console.log(checked);
        insuranceSwitch({
            carId: this.state.cars[this.state.currentIndex].car.id,
            check: checked
        }).then((res) => {
            console.log(res);
        }).catch((error) => { console.log(error) });



        let cars = this.state.cars;
        cars[this.state.currentIndex].car.needInsuranceRemind = checked;

        this.setState({
            cars: cars
        });
    }

    //处理年检提醒
    OnHanleAnnualInspection = (checked) => {
        annualSwitch({
            carId: this.state.cars[this.state.currentIndex].car.id,
            check: checked
        }).then((res) => {
            console.log(res);
        }).catch((error) => { console.log(error) });

        let cars = this.state.cars;
        cars[this.state.currentIndex].car.needInspectionRemind = checked;

        this.setState({
            cars: cars
        });
    }





    render() {
        let offsetX = -10; // just for pc demo
        if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
            offsetX = -26;
        }
        let carlist = this.state.cars.map((item, index) => {

            console.log(item);

            return <Flex key={index} className="swiper-slide carItem">
                {this.state.mode && <span style={{ width: '.6rem', margin: '0 .18rem', textAlign: 'center', height: '.42rem', fontSize: '.22rem', lineHeight: '.42rem', background: '#e42f2f', color: '#fff' }} onClick={() => { this.delCar(item.car.id) }}>删除</span>}
                <img className='car_icon' style={{ marginLeft: this.state.mode ? '0' : '.54rem' }} src={require("../../"+(item.car.carMark?"carImgs/"+item.car.carMark:'img/car_icon')+".jpg")}  alt="" />
                <div>
                    <div className='licensePlate'>{item.car.licensePlate}</div>
                    <div className='type'>{item.car.carbrand}</div>
                </div>
                <div className={item.car.defaultCar ? 'check' : 'no-check'} onClick={() => { this.setDefaultIndex(item.car.id, index) }}>
                    <Icon type='check-circle-o' />
                    <div className={item.car.defaultCar ? '' : 'hidden'}>默认</div>
                </div>

            </Flex>
        });

        let cars = this.state.cars;
        let time = 0;
        let carId = -1;
        if (cars.length > 0) {
            time = cars[this.state.currentIndex].time;
            carId = cars[this.state.currentIndex].car.id;
        }

        return <div className="body-bac">
            <div className="nav-bar-title">
                <i className="back" onClick={() => { this.props.history.push(`/center/${window.localStorage.getItem('openid')}/${window.localStorage.getItem('nickName')}/${window.localStorage.getItem('headimgurl')}`) }}></i>
                爱车信息
            <span className="scan" onClick={() => {
                    this.setState({
                        visible: !this.state.visible
                    })
                }}>编辑</span>
            </div>
            <Popover mask
                overlayClassName="fortest"
                overlayStyle={{ color: 'currentColor' }}
                visible={this.state.visible}
                overlay={[
                    (<Item key="4" value="scan" data-seed="logId" onClick={
                        () => {
                            this.setState({
                                mode: 'delete',
                                visible: !this.state.visible
                            })
                        }
                    } >删除</Item>),
                ]}
                align={{
                    overflow: { adjustY: 0, adjustX: 0 },
                    offset: [offsetX, 15],
                }}
                onVisibleChange={this.handleVisibleChange}
                onSelect={this.onSelect}
            >
                <div style={{
                    height: '100%',
                    padding: '0 0.3rem',
                    marginRight: '-0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                }}
                >
                </div>
            </Popover>
            <div style={{ margin: '0 10px' }}>
                <div className="swiper-container carInfo" ref={self => this.swiperID = self}>
                    <div className="swiper-wrapper">
                        {carlist}
                        <div className="swiper-slide addItem" onClick={() => { this.props.history.push('/addCar/0') }} >+</div>
                    </div>
                </div>
            </div>

            <List className='remind-item' style={{ margin: '10px' }}>
                <List.Item extra={<Switch checked={this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInsuranceRemind : false}
                    onClick={(checked) => { this.OnHanleinsurance(checked) }} />}>
                    <Flex>
                        <img className='icon' src={insurance} alt="" />
                        保险提醒
                    </Flex>
                </List.Item>
                <Flex className='remind-tip' style={{ display: (this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInsuranceRemind : false) ? '' : 'none' }} onClick={() => { this.props.history.push(`/insurance/${carId}`) }}>
                    <div>距离下次续保时间还有<span className='day'>{time}</span>天</div>
                    <img src={more_arrow} alt="" className='more' />
                </Flex>
            </List>

            <List className='remind-item' style={{ margin: '10px' }}>
                <List.Item extra={<Switch checked={this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInspectionRemind : false}
                    onClick={(checked) => { this.OnHanleAnnualInspection(checked) }} />}>
                    <Flex>
                        <img className='icon' src={annualInspection} alt="" />
                        年检提醒
                    </Flex>
                </List.Item>

                <div style={{ display: (this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInspectionRemind : false) ? '' : 'none' }}>
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra=""
                        value={this.state.inspectionTime}
                        onChange={(e) => {
                            annualCheck({
                                //clientId: 157,
                                clientId: window.localStorage.getItem('clientId'),
                                id: carId,
                                licenseDate: e.format('YYYY-MM-DD'),
                            }).then((res) => {
                                if (res.data.code == '0') {
                                    let cars = this.state.cars;
                                    let car = cars[this.state.currentIndex];
                                    car.day = res.data.day;
                                    this.setState({
                                        cars: cars
                                    })
                                }
                            }).catch((error) => { console.log(error) });
                            // this.setState({ inspectionTime: e })
                        }}
                    >
                        <List.Item arrow="horizontal">
                            <span style={{ fontSize: '.8em', marginLeft: '.27rem', display: ((this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInspectionRemind : false) && this.state.cars[this.state.currentIndex].day == -1) ? '' : 'none' }}>请选择车辆注册日期</span>
                            <span style={{ fontSize: '.8em', marginLeft: '.27rem', display: ((this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].car.needInspectionRemind : false) && this.state.cars[this.state.currentIndex].day >= 0) ? '' : 'none' }}>距离下次续保时间还有<span className='day'>{this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].day : 0}</span>天</span>
                        </List.Item>


                    </DatePicker>
                </div>

                {/* <Flex className='remind-tip' style={{ display: (this.state.inspectionTip && this.state.cars[this.state.currentIndex].day >= 0) ? '' : 'none' }}>
                    <div>距离下次续保时间还有<span className='day'>{this.state.cars.length > 0 ? this.state.cars[this.state.currentIndex].day : 0}</span>天</div>
                    <img src={more_arrow} alt="" className='more' />
                </Flex> */}
            </List>

        </div>
    }
}

export default withRouter(CarInfo);