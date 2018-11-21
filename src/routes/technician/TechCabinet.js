import React from 'react';
import { withRouter } from "react-router-dom";
import CabinetHeader from '../technician/CabinetHeader';
import TechBottomBar from './TechBottomBar';
import Serving from './Serving';
import { Tabs, WhiteSpace, Badge, Flex } from 'antd-mobile';
import './TechCabinet.less';


const TabPane = Tabs.TabPane;

class TechCabinet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      services: [
        {
          title: '苏A123AO',
          car: '宝马X1',
          type: '普洗',
          time: '2018-05-09 10:30:00',
          state: 1
        },
        {
          title: '苏ASS007',
          car: '奥迪A4',
          type: '普洗',
          time: '2018-05-09 10:30:00',
          state: 1
        }],
      cards: [
        {
          title: '苏A124R0',
          car: '宝马S3',
          box: 1
        },
        {
          title: '苏A78R07',
          car: '奥迪A4',
          box: 3
        },
        {
          title: '苏A12XX7',
          car: '大众荣威',
          box: 6
        }
      ]
    }
  }
    render() {
        // const serving,reservated
      const serving = this.state.services.map((item, index) => {

        return (
            <div className="tech-cabinet-body">
              <Flex className="my-reservation-info">
                <div className="little-box"></div>
                <Flex.Item className="reservation-time">
                  <span>{item.title}</span>
                  {/* {this.state.createDate} */}
                </Flex.Item>
                <Flex.Item className="car-num">{item.car}</Flex.Item>
              </Flex>

              <div className="order-track-line"></div>

              <div style={{ margin: '0 .22rem 0 .22rem', backgroundColor: '#fff' }}>
                <div className='order-list'>
                  <Flex style={{ height: '100%' }}>
                    <Flex.Item className='leftLable'>服务项目</Flex.Item>
                    <Flex.Item className='rightText'>
                      {/* {this.state.createDate} */}
                      {item.type}
                    </Flex.Item>
                  </Flex>
                </div>
                <div className="pay-order-line-dashed"></div>

                <div className='order-list'>
                  <Flex style={{ height: '100%' }}>
                    <Flex.Item className='leftLable'>接单时间</Flex.Item>
                    <Flex.Item className='rightText'>
                      {item.time}
                    </Flex.Item>
                  </Flex>
                </div>
                <div className="pay-order-line-dashed"></div>
                <div className='order-list'>
                  <Flex style={{ height: '100%' }}>
                    <Flex.Item className='leftLable'>订单状态</Flex.Item>
                    <Flex.Item className='rightText'>
                      {item.state === 1 ? '已接车' : (item.state === 2 ? '已完工' : '已交车')}
                    </Flex.Item>
                  </Flex>
                </div>
                <div className="pay-order-line-dashed"></div>
                <div className='order-list'>
                  <button className='complation-button'>确认完工</button>
                </div>

              </div>

            </div>
        );
      }), reservated = this.state.cards.map((item, index) => {
        return (
            <div className="tech-cabinet-body">
              <div style={{ margin: '0 .22rem 0 .22rem', backgroundColor: '#fff' }}>
                <div className='tech-cabinet-index'>
                  <div>{index + 1}</div>
                </div>
                <div className='tech-cabinet-item'>
                  <span>{item.box}号柜</span>
                  <span>{item.title}</span>
                  <span>{item.car}</span>
                  <button>一键开柜</button>
                </div>
              </div>
            </div>
        )
      })



      return (
            <div>
                 <Serving/>
                 <TechBottomBar nowTab={1}/>
            </div>

        )

    }
}
export default withRouter(TechCabinet);


