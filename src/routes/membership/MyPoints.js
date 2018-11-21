import React from 'react';
import NavBar from '../../components/NavBar'
import { Flex } from 'antd-mobile'
import './MyCard.less'
import { myPoints } from '../../services/user'
class MyPoints extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            point:[]
        }
    }

    componentDidMount() {
        myPoints({
            clientId:  window.localStorage.getItem('clientId')
        }).then((res) => {
            console.log(res)
            this.setState({
                point: res.data.point
            })
        }).catch((error) => {
            console.log(error)
        })
    }
    render() {
        let totalPoint = 0
        let points = this.state.point.map((item, index) => {
            totalPoint = item.point+totalPoint
            return <Flex className="detail" key={index}>
                <Flex direction="column" align="start">
                    <div className="comment">
                        订单评价积分
                </div>
                    <div className="time">
                        {item.commentDate}
                    </div>
                </Flex>
                <Flex.Item className="money">
                    +{item.point}
                </Flex.Item>
            </Flex>
        })
        return <div className="body-bac">
            <NavBar title="我的积分" />
            <div className="my-total-point">
                <Flex className="circle" justify="center" direction="column" >
                    <div>积分</div>
                    <div>{totalPoint}</div>
                </Flex>
            </div>
            <div className="my-total-point-content">
                <div className="wait">
                    积分商城敬请期待...
                </div>
                <div className="title">
                    积分明细30天内
                </div>
                {points}
            </div>
        </div>
    }
}
export default MyPoints