import React from 'react';
import './orderDetail.less'
import { Flex } from 'antd-mobile'
import NavBar from '../../components/NavBar'
class OrderDetail extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return <div className="body-bac">
            <NavBar title="订单详情" />

            <Flex className="order-track-baseinfo">
                <Flex.Item className="Info">
                    <p>姓名：何梦成</p>
                    <div>牌照号：苏A233333</div>
                </Flex.Item>
                <Flex.Item className="state">已交车</Flex.Item>
            </Flex>
            <div className="order-track-line"></div>

            <div style={{ margin: '0 .22rem 0 .22rem', backgroundColor: '#fff' }}>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单总额</Flex.Item>
                        <Flex.Item className='rightText' style={{ color: 'red' }}>￥200</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单编号</Flex.Item>
                        <Flex.Item className='rightText'>TH15289345 </Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>订单时间</Flex.Item>
                        <Flex.Item className='rightText'>2017-08-07 10:00:00</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>支付方式</Flex.Item>
                        <Flex.Item className='rightText'>线上支付</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>支付状态</Flex.Item>
                        <Flex.Item className='rightText'>已支付</Flex.Item>
                    </Flex>
                </div>
            </div>


            <div style={{ margin: '.21rem .22rem 0 .22rem', backgroundColor: '#fff' }}>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable' style={{ color: '#4b4b4b' }}>服务项目</Flex.Item>
                    </Flex>
                </div>
                <div style={{ margin: '0 .42rem 0 .52rem', border: '.005rem #f0f0f0 solid' }}></div>

                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>内饰除菌SPA</Flex.Item>
                        <Flex.Item className='rightText'>X 1</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>内饰除菌SPA</Flex.Item>
                        <Flex.Item className='rightText'>X 1</Flex.Item>
                    </Flex>
                </div>
                <div className='order-list'>
                    <Flex style={{ height: '100%' }}>
                        <Flex.Item className='leftLable'>内饰除菌SPA</Flex.Item>
                        <Flex.Item className='rightText'>X 1</Flex.Item>
                    </Flex>
                </div>
            </div>


            {/* <div className='bottom-pay-button'>
                <Flex style={{ height: '100%' }}>
                    <Flex.Item className='lable'>合计:</Flex.Item>
                    <Flex.Item style={{color:'red'}}>￥999</Flex.Item>
                    <div className='pay-button'>
                        <Flex style={{ height: '100%' }}>
                            <Flex.Item style={{textAlign:'center',color:'#fff'}}>立即购买</Flex.Item>
                        </Flex>
                    </div>

                </Flex>
            </div> */}

        </div>
    }
}

export default OrderDetail