import request from '../utils/request';

export const login = (data: any) => {
    console.log(data);
    return request({
        url: '/user/login',
        method: 'post',
        data: data
    });
};
export const getAll = (pageIndex: any,pageSize: any) => {
    return request({
        url: '/user/all',
        method: 'get',
        params:{
            pageIndex:pageIndex,
            pageSize:pageSize
        }
    });
};


export const update = (data: any) => {
    return request({
        url: '/user/',
        method: 'put',
        data: data
    });
};

export const deleteUser = (id: any) => {
    return request({
        url: '/user',
        method: 'delete',
        params:{
            id:id
        }
    });
};

export const addUser = (data: any) => {
    return request({
        url: '/user/',
        method: 'post',
        data: data
    });
};
