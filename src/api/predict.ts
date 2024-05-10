import request from '../utils/request2';

export const test = (data: any) => {
    console.log(data);
    return request({
        url: '/test',
        method: 'post',
        data: data,
        timeout: 5 * 60 * 1000,
        responseType: 'blob'
    })
}
