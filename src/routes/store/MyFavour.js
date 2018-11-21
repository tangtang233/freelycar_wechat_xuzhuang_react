import React from 'react';
import NavBar from '../../components/NavBar'
import { Flex } from 'antd-mobile'
import './CooperativeStore.less'
import { myPoints } from '../../services/user'
import {withRouter} from "react-router-dom";
import { userDetail } from '../../services/user.js'
class MyFavour extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tickets:[]
        }
    }

    componentDidMount() {
        userDetail({
            clientId: window.localStorage.getItem('clientId')
        }).then((res) => {
            if (res.data.code == '0') {
                let data = res.data
                this.setState({
                    tickets: data.client.tickets
                })
            }
        }).catch((error) => {
            console.log(error)
        })
    }
    render() {
        let tickets = this.state.tickets.map((item,index)=>{
            let totalPrice = 0;
            for(let item of item.favour.set) {
                totalPrice = totalPrice -item.presentPrice+item.project.price
            }
           
            return  <Flex key={index} className="coupon" direction="column" align="start" style={{marginTop:'.2rem'}}>
            <Flex style={{ height: '1.3rem', background: '#fff', width: '100%' }}>
                <Flex className="money" direction="column">
                    <div style={{ fontSize: '.4rem' }}><span style={{ fontSize: '.18rem' }}>￥</span>{totalPrice}</div>
                    <div style={{ color: '#8c8c8c', fontSize: '.22rem'}}>{item.favour.type==1?'抵用券':'代金券'}</div>
                </Flex>
                <div className="parting-line"></div>
                <Flex style={{ flex: 'auto' }}>
                    <Flex direction="column" align="start">
                        <div style={{ fontSize: '.3rem',lineHeight:'.45rem', marginLeft: '.2rem' ,marginBottom:'.05rem'}}>{item.favour.name}</div>
                        <div style={{ fontSize: '.2rem', lineHeight: '.25rem', marginLeft: '.2rem' }}>{item.favour.content}</div>
                    </Flex>
                    <div className="use-button" onClick={()=>{
                        this.props.history.push('/store-detail?storeId=1')
                        // history.pushState(null,null,`/freelycar_wechat/index.html#/store-detail?storeId=1`);
                        // window.location.reload();
                        }} style={{width:'1rem',height:'.32rem',border:'1px  solid #ee5e5e',fontSize:'.22rem',lineHeight:'.32rem',borderRadius:'.05rem',color:'#ee5e5e',textAlign:'center'}}>
                        到店使用 
                </div>
                </Flex>
            </Flex>
            <div className="coupon-info">
                <span className="phone">限客户手机号：{window.localStorage.getItem('phone')}</span>
                <span className="time">截止日期：{item.expirationDate.slice(0,10)}</span>
            </div>
        </Flex>
        })
        return <div className='store-detail my-favour body-bac'>
            <NavBar title="我的优惠" />
            {tickets}
        </div>
    }
}
export default withRouter(MyFavour);