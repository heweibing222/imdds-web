import request from '../utils/request';


export const getAll = (pageIndex: any,pageSize: any) => {
    return request({
        url: '/rsImage/all',
        method: 'get',
        params:{
            pageIndex:pageIndex,
            pageSize:pageSize
        }
    });
};

export const search = (data: any) => {
    return request({
        url: '/rsImage/search',
        method: 'post',
        data: data
    });
};


export const add = (data: any) => {
    return request({
        url: '/rsImage/',
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000
    });
};




export const update = (data: any) => {
    return request({
        url: '/rsImage/',
        method: 'put',
        data: data
    });
};

export const deleteRsImage = (id: any) => {
    return request({
        url: '/rsImage',
        method: 'delete',
        params:{
            id:id
        }
    });
};

export const getList = (id:any) => {
    return request({
        url: '/rsImage/getList',
        method: 'get',
        params:{
            id:id
        }
    });
};

export const publish = (id:any) => {
    return request({
        url: '/rsImage/publish',
        method: 'get',
        timeout: 5 * 60 * 1000,
        params:{
            id:id
        }
    });
};




