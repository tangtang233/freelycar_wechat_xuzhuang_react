import React from 'react';
import { Flex ,Toast} from 'antd-mobile'
import {withRouter} from "react-router-dom";
import login from '../../img/logo.png';
import phone from '../../img/phone.png';
import password from '../../img/password.png';
import { verification, verifySmsCode } from '../../services/sms.js'
import { activity } from '../../services/pay.js'
import '../auth/login.less'
class Activity extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            allowSend: true,
            isphone: false,
            wait: 60
        }
    }

    componentDidMount() {
        if (window.localStorage.getItem('hasget')) {
            Toast.success('您已领取优惠券', 3, () => {
                this.props.history.push('/receivecoupons')
            });
        }
    }
    sendCode() {
        let myHeaders = new Headers({
            "Content-Type": "form-data",
        })
        if (this.state.allowSend && this.state.isphone) {
            verification({
                method: 'post',
                headers: myHeaders,
                mode: 'cors',
                cache: 'default'
            }, {
                    phone: this.state.phone
                }).then((res) => {
                    if (res.data.code == '0') {
                        this.setState({
                            allowSend: false
                        })
                        this.timer = setInterval(() => {
                            let wait = this.state.wait
                            this.setState({
                                wait: wait - 1
                            })
                            if (this.state.wait < 1) {
                                this.setState({
                                    allowSend: true,
                                    wait: 60
                                })
                                clearInterval(this.timer)
                            }
                        }, 1000)
                    }
                }).catch((error) => {
                    console.log(error)
                })
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }

    Login() {
        // const {openid, headimgurl,nickname} = this.context.router.params;
        let myHeaders = new Headers({
            "Content-Type": "form-data",
        })

        verifySmsCode({
            method: 'post',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        }, {
                openId: this.props.match.params.openid,
                phone: this.state.phone,
                smscode: this.state.smscode,
                headimgurl: this.props.match.params.headimgurl,
                nickName: this.props.match.params.nickname
            }).then((res) => {
                console.log(res)
                if (res.data.client.phone) {
                    window.localStorage.setItem('headimgurl', this.props.match.params.headimgurl)
                    window.localStorage.setItem('nickName', this.props.match.params.nickname)
                    window.localStorage.setItem('phone', res.data.client.phone)
                    window.localStorage.setItem('openid', this.props.match.params.openid)
                    window.localStorage.setItem('clientId', res.data.client.id)
                    activity({
                        clientId: res.data.client.id
                    }).then((res) => {
                        if (res.data.code == '0') {
                            window.localStorage.setItem('hasget', true)
                            this.props.history.push('/receivecoupons')
                        }
                    }).catch((error) => { console.log(error) })

                }
            }).catch((error) => { console.log(error) })
    }

    render() {
        return <div className='loginbg activity-bac'>
            <div className='panel' >
                <p style={{ padding: '.3rem 0', lineHeight: '.46rem', fontSize: '.3rem', textAlign: 'center', color: '#5b87e5' }}>输入手机号领取500元养车礼券</p>
                <Flex justify='center'  >
                    <div className='input-up'>
                        <img src={phone} style={{ width: '.3rem', marginLeft: '.18rem', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        <input className='no-border' style={{ width: '4.3rem' }} onChange={(e) => {
                            if ((/^1(3|4|5|7|8)\d{9}$/.test(e.target.value))) {
                                this.setState({
                                    phone: e.target.value,
                                    isphone: true
                                })
                            } else {
                                this.setState({
                                    phone: e.target.value,
                                    isphone: false
                                })
                            }
                        }} placeholder="请输入手机号码" />
                    </div>
                </Flex>
                <Flex justify='center'>
                    <div className='input-up'>
                        <img src={password} style={{ width: '.34rem', marginLeft: '.18rem', marginRight: '0.48rem', verticalAlign: 'middle' }} />
                        <input className='no-border' placeholder="请输入验证码" style={{ display: 'inner-block', width: '2rem' }} onChange={(e) => { this.setState({ smscode: e.target.value }) }} />
                        <div style={{ display: 'inline-block', color: this.state.isphone ? '#5b87e5' : '#a9a9a9', verticalAlign: 'middle', paddingLeft: '.33rem', borderLeft: '1px solid #e8e8e8' }} onClick={() => { this.sendCode() }}>{this.state.allowSend ? '获取验证码' : `${this.state.wait}s后重发`}</div>
                    </div>
                </Flex>
                <div style={{ textAlign: 'center', color: "#cdcdcd", lineHeight: '0.98rem', fontSize: '.18rem' }}>
                    为了防止用户信息被盗,请使用本机号码
                </div>
                <div style={{ height: '0.98rem', textAlign: 'center', color: "#fff", borderRadius: '10rem', lineHeight: '0.98rem', margin: '0 .48rem 0 .48rem', background: '#3fc6c6' }} onClick={() => { this.Login() }}>
                    一键领取
                </div>
                <div className="one-line">
                    <span>活动规则</span>
                </div>
                <p className="rule">1. 优惠券新老用户同享。</p>
                <p className="rule">2. 优惠券仅限有效期内，到小易线下门店消费使用。</p>
                <p className="rule">3. 每个服务项目一次只能使用一张劵，劵不找零。</p>
                <p className="rule">4. 优惠券仅限关联此手机号的小易账户使用。</p>
                <p className="rule">5. 在法律法规允许范围内，小易爱车对本次活动拥有</p>
                <p className="rule" style={{ marginLeft: '.82rem' }}>解释权，如有疑问，请联系客服。</p>
            </div>
        </div>
    }
}

export default withRouter(Activity);
