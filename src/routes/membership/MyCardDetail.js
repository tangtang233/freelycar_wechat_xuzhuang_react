import React from 'react';
import NavBar from '../../components/NavBar'
import './MyCard.less'
import cika from '../../img/cika.png'
import zhizun from '../../img/zhizun.png'
import jinka from '../../img/jinka.png'
import baijin from '../../img/baijin.png'
import zuanshi from '../../img/zuanshi.png'
import {cardDetail } from '../../services/service' 
import {withRouter} from "react-router-dom";
class MyCardDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            card: {},
            projectInfos:[],
            name:'',
            createDate:'',
            expirationDate:'',
            type:'',
            balance:0
        }
    }

    componentDidMount(){
        cardDetail({
            cardId:this.props.match.params.id
        }).then((res)=>{
            console.log(res)
            if(res.data.code=='0') {
                this.setState({
                    card:res.data.data,
                    name:res.data.data.service.name,
                    type:res.data.data.service.type,
                    balance:res.data.data.balance,
                    projectInfos:res.data.data.projectInfos,
                    createDate:res.data.data.service.createDate,
                    expirationDate:res.data.data.expirationDate
                })
            }
        })
    }

    render() {
        let background
        switch (this.state.type) {
            case 0: background = cika; break;//次卡
            case 1: background = jinka; break;//组合卡
            case 2: background = zhizun; break;//储值卡
        }
        let detailList = this.state.projectInfos.map((item, index) => {
            return <div className="list" key={index}>
                <span className="list-name">{item.project.name}</span>
                <span className="list-time"><span className="number">{item.remaining}</span>次</span>
            </div>
        })
        return <div className="body-bac">
            <div className="nav-bar-title" style={{ marginBottom: '.3rem' }}>
                <i className="back" onClick={() => { history.back() }}></i>
                我的会员卡
                <span className="scan" onClick={()=>{this.props.history.push('/addCard')}}>添加</span>
            </div>
            <div className="membership-mycard" style={{backgroundImage:`url(${background}) `,backgroundSize:'100% 100%' }}>
                <div className="card-name">{this.state.name}</div>
                <div className="card-number">{this.state.card.cardNumber}</div>
                <div className="card-time">截止日期：{this.state.expirationDate.slice(0,10)}</div>
            </div>
            {this.state.type!=2&&<div className="card-detail-times" >
                <div className="title" >剩余次数</div>
                <div className="hr"></div>
                {detailList}
            </div>}
            {this.state.type==2&&<div className="card-detail-times" >
            <div className="list">
                <span className="list-name" >剩余金额:</span>
                <span className="list-time"><span className="number">{this.state.balance}</span>元</span>
            </div>
                <div className="hr"></div>
                {detailList}
            </div>}
        </div>
    }
}
export default withRouter(MyCardDetail);