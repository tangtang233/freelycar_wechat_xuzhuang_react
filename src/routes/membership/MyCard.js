import React from 'react';
import NavBar from '../../components/NavBar'
import './MyCard.less'
import cika from '../../img/cika.png'
import zhizun from '../../img/zhizun.png'
import jinka from '../../img/jinka.png'
import baijin from '../../img/baijin.png'
import zuanshi from '../../img/zuanshi.png'
import { myCard } from '../../services/user.js'
import {withRouter} from "react-router-dom";
class MyCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cards: []
        }
    }

    componentDidMount() {
        myCard({
            clientId:  window.localStorage.getItem('clientId')
        }).then((res) => {
            this.setState({
                cards: res.data.data
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        let card = this.state.cards.map((item, index) => {
            let background
            switch (item.service.type) {
                    case 0: background = cika; break;//次卡
                    case 1: background = jinka; break;//组合卡
                    case 2: background = zhizun; break;//储值卡
                }
            return <div key={index} className="membership-mycard" onClick={() => { this.props.history.push(`/membership/mycard/detail/${item.id}`) }} style={{ background: `url(${background})`, backgroundSize: '100% 100%' }}>
                <div className="card-name">{item.service.name}</div>
                <div className="card-number">{item.cardNumber}</div>
                <div className="card-time">截止日期：{item.expirationDate.slice(0, 10)}</div>
            </div>
        })
        return <div className="body-bac">
             <div className="nav-bar-title" style={{ marginBottom: '.3rem' }}>
                <i className="back" onClick={() => { history.back() }}></i>
                我的会员卡
                <span className="scan" onClick={() => { this.props.history.push('/addCard') }}>添加</span>
            </div>
            {card}
        </div>
    }
}
export default withRouter(MyCard);