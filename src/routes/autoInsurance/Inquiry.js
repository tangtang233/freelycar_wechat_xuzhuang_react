import React from 'react';
import NavBar from '../../components/NavBar'
import './Inquiry.less'
import '../addCar/AddCar.less'
import { List, InputItem, WhiteSpace, Picker, Flex, Popup, Toast, Icon } from 'antd-mobile'
import { insuranceAsk } from '../../services/insurance.js'
const Item = List.Item,
    insuredCompany = [
        { label: "中国人保车险", value: "中国人保车险" },
        { label: "平安车险", value: "平安车险" },
        { label: "太平洋车险", value: "太平洋车险" },
        { label: "中华联合车险", value: "中华联合车险" },
        { label: "大地车险", value: "大地车险" },
        { label: "天安车险", value: "天安车险" },
        { label: "永安车险", value: "永安车险" },
        { label: "阳光车险", value: "阳光车险" },
        { label: "安邦车险", value: "安邦车险" },
        { label: "太平车险", value: "太平车险" },
        { label: "其他", value: "其他" },
    ]
class Inquiry extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            province: '苏',
            carModel: '',
            carPlate: '',
            name: '',
            insuredCompany: '',
            phone:''
        }
    }
    componentDidMount() {

        if(!window.localStorage.getItem('openid')) {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx89ac1808e298928d&redirect_uri=http%3a%2f%2fwww.freelycar.com%2ffreelycar_wechat%2fapi%2fuser%2fwechatlogin%3FhtmlPage%3Dinquiry%26isAuth%3dtrue&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
        }
        let mySwiper4 = new Swiper(this.swiperID, {
            direction: 'horizontal',
            loop: true,
            // 如果需要分页器
            pagination: '.swiper-pagination',
        });
    }

    inquiry = () => {

        let myHeaders = new Headers({
            "Content-Type": "form-data",
        })
        insuranceAsk({
            method: 'post',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        }, {
                name: this.state.name,
                licensePlate: this.state.province + this.state.carPlate,
                phone: window.localStorage.getItem('phone')?window.localStorage.getItem('phone'):this.state.phone,
                insuranceCompany: this.state.insuredCompany[0],
                intent: ''
            }).then((req) => {
                if (req.data.code == '0') {
                    Toast.success('我们将尽快联系您，为您提供专业车险报价！', 5);
                } else {
                    Toast.fail(req.data.msg, 5);
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    selectProvince(item) {
        Popup.hide()
        this.setState({
            province: item
        })
    }

    PopupModal() {
        let province = ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀', '豫', '川', '渝', '辽', '吉', '黑', '皖', '鄂', '湘', '赣', '闽', '陕', '甘', '宁', '蒙', '津', '贵', '云', '桂', '琼', '青', '新', '藏'];
        let items = province.map((item, index) => {
            return <li key={index} onClick={() => { this.selectProvince(item) }} style={{ float: 'left', color: this.state.province == item ? '#fff' : '#666', background: this.state.province == item ? '#1e1e1e' : '#fff', width: '.915rem', height: '.915rem', textAlign: 'center', lineHeight: '.92rem', borderRight: '1px solid #eee', borderBottom: '1px solid #eee' }}>{item}</li>
        })
        Popup.show(<Flex justify="center" align="center" style={{ background: '#eee' }}>
            <ul className="clear" style={{ listStyle: 'none', width: '100%', borderTop: '1px solid #eee', borderLeft: '1px solid #eee' }}>
                {items}
            </ul>
        </Flex>, { animationType: 'slide-up', maskClosable: true });
    }
    render() {
        let show_btn = false
        if (this.state.name && this.state.carPlate) {
            show_btn = true
        }
        return <div className="body-bac">
            <NavBar title={'车险询价'}></NavBar>
            <div className="swiper-container" ref={self => this.swiperID = self}>
                <div className="swiper-wrapper">
                    <div className="swiper-slide  banner-img "><img src={require('../../img/chexian.png')} alt="" /></div>
                </div>
                <div className="swiper-pagination circle-color"></div>
            </div>
            <List className="add-car-info autoInsurance-Inquiry">
                <InputItem
                    clear
                    placeholder="填写车主姓名"
                    onChange={(e) => { this.setState({ name: e }) }}
                >
                    <div style={{ display: 'inline-block', marginLeft: '.24rem' }}>车主姓名</div>
                </InputItem>
                <InputItem
                    clear
                    placeholder="填写车牌号"
                    style={{ marginLeft: '.24rem' }}
                    maxLength="6"
                    labelNumber="6"
                    onChange={(e) => { this.setState({ carPlate: e }) }}
                >
                    <div style={{ display: 'inline-block' }}>车牌号</div>
                    <div className="card-number" style={{ display: 'inline-block', marginLeft: ' 3.3rem' }}>
                        <List.Item extra={this.state.province} arrow="down" style={{ display: 'inline-block' }} onClick={() => { this.PopupModal() }}></List.Item>
                    </div>
                </InputItem>
                {!window.localStorage.getItem('phone')? <InputItem
                    clear
                    placeholder="填写手机号码"
                    maxLength="11"
                    labelNumber="11"
                    onChange={(e) => { this.setState({ phone: e }) }}
                >
                    <div style={{ display: 'inline-block', marginLeft: '.24rem' }}>手机号码</div>
                </InputItem>: <Item extra={window.localStorage.getItem('phone')} ><div style={{ display: 'inline-block', marginLeft: '.24rem' }}>手机号码</div></Item>}
                <Picker extra="选择保险公司"
                    data={insuredCompany}
                    onOk={e => this.setState({ insuredCompany: e })}
                    cols={1}
                    onDismiss={e => console.log('dismiss', e)}
                    value={this.state.insuredCompany}
                >
                    <List.Item arrow="horizontal" style={{ marginLeft: '.24rem' }}>保险公司</List.Item>
                </Picker>
            </List>
            <div className="inquiry-button">
                <span style={{ fontWeight: 'bold', color: show_btn ? 'rgb(90, 136, 229)' : '#bbb' }} onClick={() => { if (show_btn) { this.inquiry() } }}>立即询价 ></span>
                <span className="secret">你的信息将被严格保密</span>
            </div>
            <div className="cooperative-agency">
                <div className="title">合作机构</div>
                <div className="list-body clear" >
                    <div className="list-item"><img src={require('../../img/taipingyang.png')} alt="" /></div>
                    <div className="list-item"><img src={require('../../img/yangguang.png')} alt="" /></div>
                    <div className="list-item"><img src={require('../../img/taiping.png')} alt="" /></div>
                    <div className="list-item"><img src={require('../../img/renbao.png')} alt="" /></div>
                    <div className="list-item"><img src={require('../../img/pingan.png')} alt="" /></div>
                    <div className="list-item"><img src={require('../../img/dadi.png')} alt="" /></div>
                </div>
            </div>
        </div>
    }
}

export default Inquiry

