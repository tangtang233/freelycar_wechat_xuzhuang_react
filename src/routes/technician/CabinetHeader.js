import React from "react";
import { withRouter } from "react-router-dom";
import { Flex, SearchBar, Button, Modal } from "antd-mobile";
import "./CabinetHeader.less";

class CabinetHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: null,
      quitModal: false
    };
  }
  onTextChange() {}

  render() {
    return (
      <div>
        <Modal
          title="确认退出吗?"
          transparent
          maskClosable={true}
          visible={this.state.quitModal}
          onClose={() => {
            this.setState({
              quitModal: false
            });
          }}
          footer={[
            {
              text: "取消",
              onPress: () => {
                this.setState({
                  quitModal: false
                });
              }
            },
            {
              text: "确定",
              onPress: () => {
                window.localStorage.removeItem("staffId");
                // this.props.history.push('/login')
                window.location.href =
                  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx89ac1808e298928d&redirect_uri=http%3A%2F%2Fwww.freelycar.com%2Ffreelycar_wechat%2Fapi%2Fuser%2FwechatLoginForArk%3FhtmlPage%3Dchooseid%26cabinetSN%3D" +
                  window.localStorage.getItem("cabinetSN") +
                  "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

                // this.props.history.push(`stafflogin`)
                this.setState({
                  quitModal: false
                });
              }
            }
          ]}
        />

        <Flex
          style={{
            height: "1rem",
            backgroundColor: "#fff",
            paddingLeft: "0.2rem",
            paddingRight: "0.2rem"
          }}
        >
          <Flex.Item style={{ flex: "4" }}>
            <SearchBar
              placeholder="请输入车牌号搜索"
              maxLength={7}
              cancelText=""
              showCancelButton="true"
              onChange={e => {
                //   this.setState({
                //     searchText: e
                //   });
                //   console.log(e)
                this.props.handleTextChange(e);
              }}
            />
          </Flex.Item>
          <Flex.Item>
            <Button
              style={{
                fontSize: ".2rem",
                height: ".5rem",
                lineHeight: ".5rem"
              }}
              onClick={() => {
                this.setState({
                  quitModal: true
                });
              }}
            >
              退出登录
            </Button>
          </Flex.Item>
        </Flex>
      </div>
    );
  }
}
export default withRouter(CabinetHeader);
