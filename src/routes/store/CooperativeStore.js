import React from 'react';
import { Flex, ListView } from 'antd-mobile';
import NavBar from '../../components/NavBar'
import './CooperativeStore.less'
import { storeList } from '../../services/store'
import {withRouter} from "react-router-dom";
const NUM_ROWS = 10;
// let pageIndex = 1;
let index = 10;
let dataBlob = {}
class CooperativeStore extends React.Component {

    constructor(props) {
        super(props)
        const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
        const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        this.state = {
            dataSource: dataSource.cloneWithRows({}),
            isLoading: true,
            hasMore: true,
            pageIndex: 1
        }
    }

    componentDidMount() {
        if(!window.localStorage.getItem('openid')) {
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx89ac1808e298928d&redirect_uri=http%3a%2f%2fwww.freelycar.com%2ffreelycar_wechat%2fapi%2fuser%2fwechatlogin%3fhtmlPage%3dstore%2fcooperative-store%26isAuth%3dtrue&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        }   else {

            this.genData(1)
        }

        // set
    }

    getData = (dataBlob) => {
        this.rData = { ...this.rData, ...dataBlob }
        this.setState({
            pageIndex: this.state.pageIndex + 1,
            dataSource: this.state.dataSource.cloneWithRows(this.rData),
            isLoading: false
        })
    }

    genData = (pIndex = 1) => {

        let dataBlob = []
        storeList({
            page: pIndex,
            number: 10
        }).then((res) => {
            if (res.data.code == "0") {
                for (let i = 0; i < res.data.data.length; i++) {
                    const ii = ((pIndex - 1) * NUM_ROWS) + i;
                    dataBlob[`${ii}`] = res.data.data[i];
                }
                this.setState({
                    hasMore: true
                })

            } else {
                this.setState({
                    hasMore: false,
                    isLoading: false
                })
            }
            this.getData(dataBlob)
        }).catch((error) => {
            console.log(error)
        })
    }

    onEndReached = (event) => {
        // console.log('到底部啦')
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
        if ((!this.state.isLoading) && (!this.state.hasMore)) {
            // console.log('没有数据啦')
            return;
        }
        // console.log('reach end', event);
        this.setState({ isLoading: true });
        setTimeout(() => {
            this.genData(this.state.pageIndex);
        }, 1000);
    }

    render() {
        const row = (rowData, sectionID, rowID) => {
            // if (index < 0) {
            //     index = this.state.data.length - 1;
            // }
            // const obj = this.state.data[index--];

            return (
                <Flex className="cooperative-store-list" onClick={() => {
                    this.props.history.push(`/store-detail?storeId=${rowData.store.id}`)
                    // history.pushState(null,null,`/freelycar_wechat/index.html#/store-detail?storeId=${rowData.store.id}`);
                    // window.location.reload();
                    }}>
                    <Flex className="picture">
                        <img src={rowData.store.imgUrls[0]?`http://www.freelycar.com/freelycar/store/${rowData.store.imgUrls[0].url}`:''} alt="" />
                    </Flex>
                    <Flex direction="column" align="start" justify="between" style={{ height: '1.6rem', width: '5.24rem' }}>
                        <div className="store-name">
                            {rowData.store.name}
                            {/* <span style={{ fontSize: '.18rem', color: '#e42f2f', marginLeft: '.14rem' }}>{rowData.star}分</span> */}
                        </div>
                        <Flex className="address" style={{ width: "100%" }}>
                            <div className="address-icon"></div>
                            <p className="info-font" style={{ width: '4.5rem' }}>{rowData.store.address}</p>
                        </Flex>
                        <Flex className="time" align="start" style={{ width: "100%" }} direction="column">

                                <Flex className="info-font">
                                    <div className="time-icon"></div>
                                    营业时间：{rowData.store.openingTime}-{rowData.store.closingTime}
                                </Flex>
                                {rowData.store.id == 1 && <div className="info-identify">
                                    <span className="identification">免费安全检测</span>
                                    <span className="identification">下雨保</span>
                                </div>}

                        </Flex>
                    </Flex>
                </Flex>
            );
        };


        return <div className="body-bac">
            <NavBar title="合作门店" />
            <ListView
                dataSource={this.state.dataSource}
                renderRow={row}
                renderBodyComponent={() => <MyBody />}
                onEndReached={() => this.onEndReached()}
                onEndReachedThreshold={10}
                initialListSize={6}
                pageSize={4}
                onScroll={() => { console.log('scroll'); }}
                scrollRenderAheadDistance={500}
                scrollEventThrottle={200}
                renderFooter={() => (<div style={{ padding: '.2rem', textAlign: 'center' }}>
                    {this.state.isLoading ? '加载中...' : '已显示全部门店'}
                </div>)}
                style={{
                    height: `${document.documentElement.clientHeight}`,
                    overflow: 'auto',
                }}
            >
            </ListView>
        </div>
    }

}


const MyBody = (props) => {
    return (
        <div >{props.children}</div>
    );
}
export default withRouter(CooperativeStore);
