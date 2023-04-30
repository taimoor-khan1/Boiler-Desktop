import _APi from '../../config/apiConfig'
import { CHANNEL_LIST, LOGIN, NEWS_LIST } from '../actionTypes'

// Create News  Action here
export const CreateNewsMethod = (data, successCallBack, failureCallBack) => {
    return async () => {
        console.log('data', data)
        await _APi._post(
            data,
            success => {
                if (success?.data?.status === 'success') {
                    console.log('success of create news', success)

                    successCallBack()
                } else {

                    failureCallBack()
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}

// Edit News  Action here
export const EditNewsMethod = (data, successCallBack, failureCallBack) => {
    return async () => {
        console.log('dataaaa', data)
        await _APi._post(
            data,
            success => {
                console.log('success ssss', success)
                if (success?.status === 200) {
                    console.log('success of edit news', success)

                    successCallBack()
                } else {

                    failureCallBack()
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}

// Get News Action here
export const GetNewsMethod = (data, successCallBack, failureCallBack) => {
    return async dispatch => {
        await _APi._post(
            data,
            success => {
                if (success?.data?.status === 'success') {
                    // console.log('success of get news', success);
                    dispatch({
                        type: NEWS_LIST,
                        payload: success?.data?.data
                    })
                    localStorage.setItem('newsList', JSON.stringify(success?.data?.data))

                    successCallBack()
                } else {

                    failureCallBack()
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}

// Delete News Action here
export const DeleteNewsMethod = (data, successCallBack, failureCallBack) => {
    return async () => {
        await _APi._post(
            data,
            success => {
                if (success?.data?.status === 'success') {
                    console.log('success of delete news', success)

                    successCallBack()
                } else {

                    failureCallBack()
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}
