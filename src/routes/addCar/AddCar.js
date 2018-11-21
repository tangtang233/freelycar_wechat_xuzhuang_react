import React from 'react';
import './AddCar.less';
import { Popup, List, InputItem, WhiteSpace, Picker, Button, Flex, Icon, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import NavBar from '../../components/NavBar';
import { withRouter } from 'react-router-dom';
import { addCar, userDetail } from '../../services/user.js';
import parseForm from '../../utils/parseToForm.js';
import getParameterByName from '../../utils/getParam.js';

const Item = List.Item;
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let maskProps;
if (isIPhone) {
  // Note: the popup content will not scroll.
  maskProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
class AddCar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      focused1: false,
      carModels: [],
      province: window.localStorage.getItem('province')
        ? window.localStorage.getItem('province')
        : '苏',
      carModel: '',
      carPlate: window.localStorage.getItem('carPlate'),
    };
  }

  componentDidMount() {
    const carModels = [];
    if (window.localStorage.getItem('models')) {
      JSON.parse(window.localStorage.getItem('models')).map((item, index) => {
        carModels.push({
          label: item.model,
          value: item.model,
          key: item.model,
        });
      });
      this.setState({
        carModels,
      });
    }
  }

  selectProvince(item) {
    Popup.hide();
    this.setState({
      province: item,
    });
    window.localStorage.setItem('province', item);
  }

  addCarInfos() {
    addCar({
      carbrand: window.localStorage.getItem('brandType'),
      carMark: window.localStorage.getItem('carMark'),
      cartype: this.state.carModel[0],
      licensePlate: this.state.province + this.state.carPlate,
      client: {
        id: window.localStorage.getItem('clientId'),
      },
    })
      .then((res) => {
        if (res.data.code == '0') {
          window.localStorage.removeItem('province');
          window.localStorage.removeItem('carPlate');
          if (getParameterByName('nextPage')) {
            this.props.history.push('/orderbilling');
          } else if (getParameterByName('noCar')) {
            this.props.history.push('/orderbilling');
          } else {
            this.props.history.push('/carInfo');
          }
        } else {
          Toast.fail(res.data.msg, 2);
        }
      })
      .catch((Error) => {
        console.log(Error);
      });
  }

  PopupModal() {
    const province = [
      '京',
      '沪',
      '浙',
      '苏',
      '粤',
      '鲁',
      '晋',
      '冀',
      '豫',
      '川',
      '渝',
      '辽',
      '吉',
      '黑',
      '皖',
      '鄂',
      '湘',
      '赣',
      '闽',
      '陕',
      '甘',
      '宁',
      '蒙',
      '津',
      '贵',
      '云',
      '桂',
      '琼',
      '青',
      '新',
      '藏',
    ];
    const items = province.map((item, index) => {
      return (
        <li
          key={index}
          onClick={() => {
            this.selectProvince(item);
          }}
          style={{
            float: 'left',
            color: this.state.province == item ? '#fff' : '#666',
            background: this.state.province == item ? '#1e1e1e' : '#fff',
            width: '.915rem',
            height: '.915rem',
            textAlign: 'center',
            lineHeight: '.92rem',
            borderRight: '1px solid #eee',
            borderBottom: '1px solid #eee',
          }}
        >
          {item}
        </li>
      );
    });
    Popup.show(
      <Flex justify="center" align="center" style={{ background: '#eee' }}>
        <ul
          className="clear"
          style={{
            listStyle: 'none',
            width: '100%',
            borderTop: '1px solid #eee',
            borderLeft: '1px solid #eee',
          }}
        >
          {items}
        </ul>
      </Flex>,
      { animationType: 'slide-up', maskClosable: true },
    );
  }
  render() {
    const { getFieldProps } = this.props.form;
    let greyButton = false;
    if (this.state.carPlate && window.localStorage.getItem('brandType')) {
      greyButton = true;
    }
    return (
      <div className="body-bac">
        <NavBar title="添加爱车" />
        <List className="add-car-info">
          <InputItem
            clear
            placeholder="填写车牌号"
            maxLength="7"
            labelNumber="7"
            defaultValue={window.localStorage.getItem('carPlate')}
            onChange={(e) => {
              this.setState({ carPlate: e });
              window.localStorage.setItem('carPlate', e);
            }}
          >
            <div style={{ display: 'inline-block' }}>车牌号</div>
            <div className="card-number" style={{ display: 'inline-block', marginLeft: ' 3.3rem' }}>
              <List.Item
                extra={this.state.province}
                arrow="down"
                style={{ display: 'inline-block' }}
                onClick={() => {
                  this.PopupModal();
                }}
              />
            </div>
          </InputItem>
          <Item
            className="addcar-listItem"
            extra={
              this.props.match.params.select == 1 ? (
                <span style={{ color: '#000' }}>{window.localStorage.getItem('brandType')}</span>
              ) : (
                <span style={{ color: '#bbb' }}>请选择品牌车系</span>
              )
            }
            arrow="horizontal"
            onClick={() => {
              if (getParameterByName('nextPage') || getParameterByName('noCar')) {
                this.props.history.push('/carbrand?nextPage=true');
              } else {
                this.props.history.push('/carbrand');
              }
            }}
          >
            品牌车系
          </Item>

          <Picker
            data={this.state.carModels}
            title="车型"
            cols={1}
            extra="请选择(可选)"
            onOk={(v) => {
              this.setState({ carModel: v });
            }}
            value={this.state.carModel}
          >
            <Item arrow="horizontal">车型</Item>
          </Picker>
        </List>

        <div
          className="addCar-btn"
          style={{
            background: greyButton ? '#5a88e5' : 'rgba(153,153,153,0.5)',
          }}
          onClick={(e) => {
            !greyButton ? e.preventDefault : this.addCarInfos();
          }}
        >
          保存
        </div>
      </div>
    );
  }
}

const AddCarInfo = createForm()(AddCar);
// ReactDOM.render(<AddCarInfo />, mountNode);

export default withRouter(AddCarInfo);
