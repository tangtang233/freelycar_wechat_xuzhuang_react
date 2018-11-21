import React from 'react';
import { Msg, Footer, FooterLinks, FooterLink, FooterText } from 'react-weui';
import 'weui';
import Page from './page';

const SuccessFooter = ()=>(
    <Footer>
        <FooterLinks>
            <FooterLink href="#">Footer Link</FooterLink>
        </FooterLinks>
        <FooterText>
            Copyright © 2008-2016 weui.io
        </FooterText>
    </Footer>
);

const SuccessMsg = (props) => {
    return (
    <Page className="msg_success">
        <Msg
            type="success"
            title="支付成功"
            description="We have received your feedback"
            buttons={[{//数组,可以再加按钮
                type: 'primary',
                label: '确认',
                onClick: props.history ? props.history.goBack : false
            }]}
            footer={SuccessFooter}
        />
    </Page>
    )
}

export default SuccessMsg;