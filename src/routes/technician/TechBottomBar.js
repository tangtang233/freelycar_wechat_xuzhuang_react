import React from 'react';
import { TabBar } from 'antd-mobile';
import { withRouter } from 'react-router-dom';
import './TechBottomBar.less';

class TechBottomBar extends React.Component {
  render() {
    return (
      <TabBar
        unselectedTintColor="rgba(30, 30, 30, 0.5)"
        tintColor="#1e1e1e"
        defaultActiveKey="1"
        barTintColor="white"
      >
        <TabBar.Item
          icon={<div className="tech-bottom-bar-2" />}
          selectedIcon={
            <div className="tech-bottom-bar-2 tech-bottom-bar-active" />
          }
          title="待提车"
          key="待提车"
          selected={this.props.nowTab == 2}
          onPress={() => {
            this.props.history.push('/reservationNotification');
          }}
        />
        <TabBar.Item
          title="服务中"
          key="服务中"
          icon={<div className="tech-bottom-bar-1" />}
          selectedIcon={
            <div className="tech-bottom-bar-1 tech-bottom-bar-active" />
          }
          selected={this.props.nowTab == 1}
          onPress={() => {
            this.props.history.push('/serving');
          }}
        />
      </TabBar>
    );
  }
}

export default withRouter(TechBottomBar);
