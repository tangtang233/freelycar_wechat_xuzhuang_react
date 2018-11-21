import React from 'react';
import {withRouter} from "react-router-dom";
import './activity.less'
class ReceiveCoupons extends React.Component {

    render() {
        return <div className="receive-coupon">
            <div className="put-account">优惠券已放至账户 {window.localStorage.getItem('phone')}</div>
            {/* <div className="put-account" style={{ lineHeight: '.6rem' }}>请到 <span onClick={() => this.props.history.push(`/center/${window.localStorage.getItem('openid')}/${window.localStorage.getItem('nickName')}/${window.localStorage.getItem('headimgurl')}`)} style={{ color: '#3fc6c6' }}>个人中心</span> 》 我的优惠券 查看</div> */}
            <div className="use-btn" onClick={() => { this.props.history.push('/store/detail/1') }}>到店使用</div>
            <div className="one-line">
                <span>活动规则</span>
            </div>
            <p className="rule">1. 优惠券新老用户同享。</p>
            <p className="rule">2. 优惠券仅限有效期内，到小易线下门店消费使用。</p>
            <p className="rule">3. 每个服务项目一次只能使用一张劵，劵不找零。</p>
            <p className="rule">4. 优惠券仅限关联此手机号的小易账户使用。</p>
            <p className="rule">5. 在法律法规允许范围内，小易爱车对本次活动拥有</p>
            <p className="rule" style={{ marginLeft: '1.21rem' }}>解释权，如有疑问，请联系客服。</p>
        </div>
    }
}


export default withRouter(ReceiveCoupons);