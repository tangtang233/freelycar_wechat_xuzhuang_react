import React from 'react';
import { Tabs, WhiteSpace, Badge, Flex } from 'antd-mobile';
import more_arrow from '../../img/more_arrow.png'
import { listConsumOrder, listWXPayOrder } from '../../services/orders.js'
import {withRouter} from "react-router-dom";
import TabBar from '../../components/TabBar.js'
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log('onChange', key);
}
function handleTabClick(key) {
    console.log('onTabClick', key);
}

class ServiceCard extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            services: [],
            cards: []
        }
    }

    componentDidMount() {
        listConsumOrder({
            clientId: window.localStorage.getItem('clientId'),
            page: 1,
            number: 99
        }).then((res) => {
            //console.log(res);
            if (res.data.code == '0') {
                let data = res.data.data;
                this.setState({
                    services: data
                })
            }
        }).catch((error) => { console.log(error) });

        //卡券
        listWXPayOrder({
            clientId: window.localStorage.getItem('clientId'),
            page: 1,
            number: 99
        }).then((res) => {
            console.log(res);
            if (res.data.code == '0') {
                let data = res.data.data;
                this.setState({
                    cards: data
                })
            }
        }).catch((error) => { console.log(error) });
    }


    render() {
        const services = this.state.services.map((item, index) => {
            let projects = item.projects;
            let pName = '', totalPrice = 0
            for (let i in projects) {
                if (i < 2) {
                    pName += projects[i].name + '、';
                }
                // totalPrice = totalPrice + projects[i].presentPrice + projects[i].pricePerUnit * projects[i].referWorkTime
                totalPrice = item.payState == 1 ? item.actualPrice : item.totalPrice
            }
            pName = pName.slice(0, -1)
            if (projects.length > 2) {
                pName = pName + '...'
            }

            return <Flex key={index} className="center-listItem" direction="column" onClick={() => {
                this.props.history.push(`/ordertrack?orderId=${item.id}`) 
                // history.pushState(null, null, `/freelycar_wechat/index.html#/ordertrack?orderId=${item.id}`);
                // window.location.reload();
            }}>
                <Flex style={{ width: '100%', height: '.4rem', fontSize: '.24rem', color: '#4b4b4b' }}>
                    <i className="circle"></i>
                    <p>{pName}</p>
                    <Flex.Item className="finish-state">{item.state == 1 ? '已接车' : (item.state == 2 ? '已完工' : '已交车')}&nbsp;&nbsp;<img src={more_arrow} alt="" /></Flex.Item>
                </Flex>
                <Flex style={{ width: '100%', height: '.4rem', fontSize: '.18rem', color: '#8e8e8e' }}>
                    <i className="circle2"></i>
                    <p>{item.createDate}</p>
                    <Flex.Item className="total-price">￥{totalPrice}</Flex.Item >
                </Flex>

                {item.state == 3 && item.stars == 0 ? <Flex style={{ width: '100%', fontSize: '.18rem', textAlign: 'right' }}>
                    <Flex.Item className="comments-div">
                        <div className='comments' onClick={(e) => { e.stopPropagation(); this.props.history.push(`/store/comment/${item.id}`) }}>评价得{item.totalPrice}积分</div>
                    </Flex.Item >
                </Flex> : ''}
            </Flex>;
        }), cards = this.state.cards.map((item, index) => {
            return <Flex className="center-listItem" key={index} direction="column" onClick={() => {
                this.props.history.push(`/orderDetail?orderId=${item.id}`);
                // history.pushState(null, null, `/freelycar_wechat/index.html#/orderDetail?orderId=${item.id}`);
                window.location.reload();
            }}>
                <Flex style={{ width: '100%', height: '.4rem', fontSize: '.24rem', color: '#4b4b4b' }}>
                    <i className="circle"></i>
                    <p>{item.productName}</p>
                    <Flex.Item className="finish-state">{item.payState == 0 ? '未支付' : '已支付'}&nbsp;&nbsp;<img src={more_arrow} alt="" /></Flex.Item>
                </Flex>
                <Flex style={{ width: '100%', height: '.4rem', fontSize: '.18rem', color: '#8e8e8e' }}>
                    <i className="circle2"></i>
                    <p>{item.createDate}</p>
                    <Flex.Item className="total-price">￥{item.totalPrice}</Flex.Item >
                </Flex>
            </Flex>
        })


        return <div>
            <Tabs defaultActiveKey="1" onChange={callback} onTabClick={handleTabClick}>
                <TabPane tab='服务' key="1">
                    <div style={{marginBottom:'1rem'}}>{services}</div>
                    <div className="empty-bac" style={{display:this.state.services.length < 1?'block':'none'}}></div>
                </TabPane>
                <TabPane tab='卡券' key="2">
                    <div style={{marginBottom:'1rem'}}>{cards}</div>
                    <div className="empty-bac" style={{display:this.state.cards.length < 1?'block':'none'}}></div>
                </TabPane>
            </Tabs>
            <WhiteSpace />
            <TabBar nowTab={2}/> 
        </div>
    }

}
export default withRouter(ServiceCard);