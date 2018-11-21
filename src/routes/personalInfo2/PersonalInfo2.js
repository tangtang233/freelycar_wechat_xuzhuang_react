import React from 'react';
import './PersonalInfo2.less'
import { List, InputItem, WhiteSpace, Picker } from 'antd-mobile'
import { createForm } from 'rc-form'
import { Flex } from 'antd-mobile'
import NavBar from '../../components/NavBar'
import login from '../../img/logo.png';
import { wxInfo, updateWXUser } from '../../services/user.js'
import {withRouter} from "react-router-dom";
class PersonalInfo2 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            focused: false,
            focused1: false,
            name: '',
            headimgurl: '',
            birthday:'',
            nickName: window.localStorage.getItem('nickName')
        }
    }

    componentDidMount() {
        wxInfo({
            openId: window.localStorage.getItem('openid')
        }).then((res) => {
            console.log(res)
            if (res.data.code == '0') {
                let data = res.data.data
                this.setState({
                    point: data.point,
                    nickName: data.wxUser.nickName,
                    name: data.wxUser.name,
                    headimgurl: data.wxUser.headimgurl,
                    birthday: data.wxUser.birthday?data.wxUser.birthday.slice(0,10):'',
                    gender: [data.wxUser.gender]
                })
            }
        }).catch((error) => { console.log(error) });
    }

    updateInfo() {
        updateWXUser( 
            {
                // openId: '1',
                phone: window.localStorage.getItem('phone'),
                // phone: '110',
                birthday: this.state.birthday,
                name: this.state.name,
                gender: this.state.gender[0]
            }).then((res) => {
                console.log(res)
                this.props.history.push(`/indexPage`)
            })
    }

    render() {
        const { getFieldProps } = this.props.form;
        return <div className="body-bac">
            <NavBar title="个人信息"></NavBar>
            <List className="add-car-info personal-info">
                <Flex justify='center' style={{ height: '1.6rem' }}>
                    <img className='logo' src={decodeURIComponent(window.localStorage.getItem('headimgurl'))} style={{ width: '1.16rem' }} />
                </Flex>
                <InputItem
                    // clear
                    placeholder='请填写真实姓名'
                    focused={this.state.focused}
                    value={this.state.name}
                    onFocus={() => {
                        this.setState({
                            focused: false,
                        });
                    }}
                    onChange={(value) => {
                        this.setState({
                            name: value
                        })
                    }}
                    style={{font:'0.32rem 黑体', color: '#1e1e1e'}}
                >姓名</InputItem>

                <Picker
                    extra="男 / 女"
                    data={[
                        { label: '男', value: '男' },
                        { label: '女', value: '女' },
                    ]} cols={1}
                    value={this.state.gender}
                    onChange={(value) => {
                        this.setState({
                            gender: value
                        })
                    }}
                >
                    <List.Item style={{ borderBottom: '1px solid #efefef',font:'0.32rem 黑体', color: '#1e1e1e' }} className={'personInfo-gender'}>性别</List.Item>
                </Picker>
                <InputItem
                    {...getFieldProps('phone')}
                    type="phone"
                    placeholder="138 0516 5099"
                    style={{font:'0.32rem 黑体', color: '#1e1e1e'}}
                    >手机号
                </InputItem>
                <InputItem
                    // clear
                    placeholder="1994-11-01"
                    focused={this.state.focused}
                    value={this.state.birthday ? this.state.birthday.slice(0, 10) : this.state.birthday}
                    onFocus={() => {
                        this.setState({
                            focused: false,
                        });
                    }}
                    onChange={(value) => {
                        this.setState({
                            birthday: value
                        })
                    }}
                    style={{font:'0.32rem 黑体', color: '#1e1e1e'}}
                >生日</InputItem>
            </List>

            <div className="addCar-btn" onClick={() => { window.localStorage.setItem('isInfoSaved', true); console.log(window.localStorage.getItem('isInfoSaved')); this.updateInfo() }}>保存</div>
            <div style={{ color: '#5a5a5a', marginTop: '.25rem', textAlign: 'right', paddingRight: '.22rem' }} onClick={() => { this.props.history.push(`/indexPage`) }}>跳过</div>
        </div>
    }

}

const Personal = createForm()(PersonalInfo2);

export default withRouter(Personal);