
import { login } from '../services/user.js'
import { routeRedux } from 'dva/router'
const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
export default {

  namespace: 'app',

  state: {
    loginLoading:false
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },//监听数据

  effects: {
    *login({ payload }, { call, put }) {  //put 用来发起一条action、call 以异步的方式调用函数、select从 state中获取相关的数据，take获取发送的数据
      yield put({ type: 'showLoginLoading' });
      yield call(delay, 2000)
      yield put({ type :'hideLoginLoading'})
      yield call(delay,1000)
      yield put(routerRedux.push('/main'))
    },
  },//接收数据

  reducers: {
    showLoginLoading(state,action) {
      return {
        loginLoading:true,
      }
    },
    hideLoginLoading(state,action){
      return {
        loginLoading:false
      }
    }
  },//处理数据
};
