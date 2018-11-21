import get from '../utils/get';
import request from '../utils/request';
export default {
    //消费单据支付
    insuranceAsk: (options,params) => {
        return request('api/insurance/ask',options,params);
    },
    
}