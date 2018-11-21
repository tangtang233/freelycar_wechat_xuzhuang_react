import get from '../utils/get';
export default {
    storeList: (params) => {
        return get('api/store/list', params);
    },
    storeDetail: (params) => {
        return get('api/store/detail',params)
    },
    storeComment: (params) => {
        return get('api/store/comment', params)
    },
    listComment:(params)=>{
        return get('api/store/listComment',params)
    },
    favourDetail:(params)=>{
        return get('api/store/favourDetail',params)
    }
}