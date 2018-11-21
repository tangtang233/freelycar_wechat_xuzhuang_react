import { ListView, List, Flex, Drawer } from "antd-mobile";
import NavBar from "../../components/NavBar";
import DasAuto from "../../img/das_auto.jpg";
import fute from "../../img/fute.jpg";
import { withRouter } from "react-router-dom";
import getParameterByName from "../../utils/getParam.js";
const { Item } = List;

class SelectCarBrand extends React.Component {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    const getRowData = (dataBlob, sectionID, rowID) => dataBlob[rowID];

    const dataSource = new ListView.DataSource({
      getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });

    const dataBlob = {};
    const sectionIDs = [];
    const rowIDs = [];
    const carData = car.data;
    Object.keys(carData).forEach((item, index) => {
      sectionIDs.push(item);
      dataBlob[item] = item;
      rowIDs[index] = [];
      carData[item].forEach(jj => {
        rowIDs[index].push(jj.brand);
        dataBlob[jj.brand] = jj;
      });
    });
    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(
        dataBlob,
        sectionIDs,
        rowIDs
      ),
      headerPressCount: 0,
      open: false,
      types: [],
      carBrand: "",
      type: "",
      pinyin: "",
      models: [],
      hotlist: [
        { img: require(`../../carImgs/大众.jpg`), pinyin: "D", name: "大众" },
        { img: require(`../../carImgs/福特.jpg`), pinyin: "F", name: "福特" },
        { img: require(`../../carImgs/本田.jpg`), pinyin: "B", name: "本田" },
        { img: require(`../../carImgs/丰田.jpg`), pinyin: "F", name: "丰田" },
        { img: require(`../../carImgs/别克.jpg`), pinyin: "B", name: "别克" },
        { img: require(`../../carImgs/奥迪.jpg`), pinyin: "A", name: "奥迪" },
        { img: require(`../../carImgs/现代.jpg`), pinyin: "X", name: "现代" },
        {
          img: require(`../../carImgs/雪佛兰.jpg`),
          pinyin: "X",
          name: "雪佛兰"
        },
        { img: require(`../../carImgs/奔驰.jpg`), pinyin: "B", name: "奔驰" },
        { img: require(`../../carImgs/宝马.jpg`), pinyin: "B", name: "宝马" }
      ]
    };
  }

  onOpenChange = (e, i) => {
    let obj = {
      open: !this.state.open
    };
    if (i) {
      obj = {
        open: !this.state.open,
        type: i.type,
        models: i.models
      };
      let newType = i.type;
      if (i.type.indexOf(this.state.carBrand) != -1) {
        newType = i.type.slice(this.state.carBrand.length);
      }
      window.localStorage.setItem("models", JSON.stringify(i.models));
      window.localStorage.setItem("brandType", this.state.carBrand + newType);
      window.localStorage.setItem("carMark", this.state.carBrand);
      if (getParameterByName("nextPage")) {
        this.props.history.push("/addCar/1?nextPage=true");
      } else {
        this.props.history.push("/addCar/1");
      }
    }
    this.setState(obj);
  };

  hotClick = item => {
    let carObj = car.data[item.pinyin].filter(obj => {
      return obj.brand == item.name;
    });
    this.setState({
      carBrand: item.name,
      types: carObj[0].types
    });
    this.onOpenChange();
  };

  render() {
    let hotlist = this.state.hotlist.map((item, index) => {
      return (
        <Flex
          key={index}
          className={index > 4 ? "one-item border-no" : "one-item"}
          direction="column"
          onClick={() => {
            this.hotClick(item);
          }}
        >
          <img src={item.img} alt="" />
          <div>{item.name}</div>
        </Flex>
      );
    });
    const sidebar = (
      <List>
        <List.Item key={-1} multipleLine>
          <img
            style={{ verticalAlign: "middle" }}
            src={require(`../../carImgs/${
              this.state.carBrand ? this.state.carBrand : "大众"
            }.jpg`)}
            style={{ marginRight: "10px" }}
          />
          <span style={{ verticalAlign: "middle" }}>{this.state.carBrand}</span>
        </List.Item>
        {this.state.types.map((i, index) => {
          return (
            <List.Item
              key={index}
              onClick={e => {
                this.onOpenChange(e, i);
              }}
            >
              {i.type}
            </List.Item>
          );
        })}
      </List>
    );
    return (
      <div className="body-bac" style={{ height: "100%", paddingTop: "0" }}>
        <NavBar title="请选择品牌" />
        <Drawer
          className="my-drawer container"
          style={{
            minHeight: document.documentElement.clientHeight - 200,
            marginTop: ".88rem"
          }}
          position={"right"}
          contentStyle={{ color: "#1c1c1c", textAlign: "center" }}
          sidebar={sidebar}
          open={this.state.open}
          onOpenChange={e => {
            this.onOpenChange(e);
          }}
        >
          <ListView.IndexedList
            className="car-brand-header-box "
            dataSource={this.state.dataSource}
            renderHeader={() => (
              <div>
                <div
                  style={{
                    width: "100%",
                    color: "#808080",
                    background: "#fff",
                    height: ".6rem",
                    lineHeight: ".6rem",
                    marginBottom: "2px"
                  }}
                >
                  <span style={{ marginLeft: "12px" }}>热门品牌</span>
                </div>
                <Flex className="car-brand-head" wrap="wrap">
                  {hotlist}
                </Flex>
              </div>
            )}
            renderFooter={() => <span>custom footer</span>}
            renderSectionHeader={sectionData => <div>{sectionData}</div>}
            renderRow={rowData => (
              <Item
                onClick={e => {
                  this.setState({
                    carBrand: rowData.brand,
                    pinyin: rowData.pinyin,
                    types: rowData.types
                  });
                  this.onOpenChange();
                }}
              >
                <img
                  style={{ verticalAlign: "middle", marginRight: "10px" }}
                  src={require(`../../carImgs/${rowData.brand}.jpg`)}
                />
                <span style={{ verticalAlign: "middle" }}>{rowData.brand}</span>
              </Item>
            )}
            style={{
              height: document.documentElement.clientHeight,
              overflow: "auto"
            }}
            quickSearchBarStyle={{
              position: "absolute",
              top: 10,
              fontSize: ".24rem"
            }}
            delayTime={10}
            delayActivityIndicator={
              <div style={{ padding: 25, textAlign: "center" }}>
                rendering...
              </div>
            }
          />
        </Drawer>
      </div>
    );
  }
}

export default withRouter(SelectCarBrand);
