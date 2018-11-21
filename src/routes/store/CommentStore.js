import React from 'react';
import { Flex,Toast } from 'antd-mobile';
import NavBar from '../../components/NavBar'
import './CooperativeStore.less'
import CommentStar from '../../components/CommentStar'
import { orderComment } from '../../services/orders'
import {withRouter} from "react-router-dom";
class CommentStore extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            nowStar: 0,
            comment: ''
        }
    }

    setScore = (number) => {
        this.setState({
            nowStar: number
        })
    }


    comment() {
        orderComment({
            consumOrderId: this.props.match.params.consumerOrderId,
            comment: this.state.comment,
            stars: this.state.nowStar
        }).then((res) => {
            console.log(res)
            if (res.data.code == '0') {
                this.props.history.push(`/center`)
            } else {
                Toast.fail(res.data.msg,2)
            }
        })
    }
    render() {
        return <div className="body-bac">
            <NavBar title="评价" />
            <div className="comment-store">
                <Flex className="comment-store-title">
                    {/* <div className="comment-store-avatar"><img src={window.localStorage.getItem('imgUrl')} alt="" /></div> */}
                    <span className="title">{window.localStorage.getItem('storeName')}</span>
                </Flex>
                <Flex className="comment" justify="center">
                    <CommentStar setScore={this.setScore} nowStar={this.state.nowStar} />
                </Flex>
                <textarea placeholder="亲，说出你的心里话，分享给大家吧(至少输入8个字)" className="comment-text" onChange={(e) => { this.setState({ comment: e.target.value }) }}>
                </textarea>
            </div>
            <div className="comment-commit-btn" style={{ background: this.state.nowStar == 0 ? 'rgba(153,153,153,0.5)' : '#5a88e5' }} onClick={() => { this.comment() }}>提交评价</div>
        </div>
    }

}

export default withRouter(CommentStore);