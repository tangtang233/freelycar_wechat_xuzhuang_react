import React from 'react';
import { withRouter } from "react-router-dom";
import item from '../../img/item.png';
import scan_code from '../../img/scan_code.png';
import xylogo from '../../img/xylogo.png';
import './Scancode.less';

class Scancode extends React.Component {
    render() {
        return (
        <div className="body-bg">
            <div className="top-content">
                <img className="top" src={item} alt='' />
                <p className='top-title'>
                    您好，欢迎使用【小易爱车智能钥匙柜】预约服务
                </p>
            </div>
            <div className='blank'>
                <img className='scan-image' src={scan_code} alt='' />
                <p className='scan-word'>
                    点击屏幕
                </p>
                <p className='scan-word2'>
                    扫一扫使用智能柜预约服务
                </p>
            </div>
            <div className='under-content'>
                <img className='under-icon' src={xylogo} alt='' />
            </div>
        </div>)

    }
}
export default withRouter(Scancode);


