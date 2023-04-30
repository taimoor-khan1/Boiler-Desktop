import _APi from '../../config/apiConfig'

// import Toast from 'react-native-simple-toast'
// import AsyncStorage from '@react-native-async-storage/async-storage';

import { LOGIN, SIGNUP } from '../actionTypes'

// login api action here

export const LoginApiMethod = (data, successCallBack, failureCallBack) => {
    return async dispatch => {
        await _APi._post(
            data,
            success => {
                console.log("terminals", success)
                if (success?.data?.status === 'success') {
                    localStorage.setItem('userDetail', JSON.stringify(success?.data?.user))
                    successCallBack(success?.data?.user)
                    dispatch({
                        type: LOGIN,
                        payload: success?.data?.user
                    })


                    // Toast.show(success?.data?.message);
                } else {
                    failureCallBack()
                    // Toast.show('invalid Email or password', 1500);

                    alert(success?.data?.message)
                    console.log("Error on login", success?.data?.message)
                    // ToastAndroid.show(success?.data?.message)
                    // Toast.show(success?.data?.message,2000);
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}
// SignUp api action here
export const SignUpApiMethod = (data, successCallBack, failureCallBack) => {
    return async dispatch => {
        await _APi._post(
            data,
            success => {
                console.log('sucessssss', success?.data)

                if (success?.data?.status === 'success') {

                    // AsyncStorage.setItem('userDetail', success?.data?.user?.id);
                    localStorage.setItem('userDetail', success?.data?.user?.id)
                    successCallBack(success?.data?.user)
                    dispatch({
                        type: SIGNUP,
                        payload: success?.data?.user
                    })
                    // Toast.show(success?.data?.message);
                } else {
                    failureCallBack()
                    // Toast.show(success?.data?.message);
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}
// Delete api action here
// export const DeleteMethod = (data, successCallBack, failureCallBack) => {
//     return async dispatch => {
//         await _APi._post(
//             data,
//             success => {
//                 console.log('sucessssss', success?.data)

//                 if (success?.data?.status === 'success') {
//                     // AsyncStorage.setItem('userDetail', success?.data?.user?.id);
// localStorage.setItem('userDetail', success?.data?.user?.id);
//                     // successCallBack(success?.data?.user);
//                     // Toast.show(success?.data?.message);
//                 } else {
//                     // failureCallBack();
//                     // Toast.show(success?.data?.message);
//                 }
//             },
//             () => {
//                 failureCallBack()
//             }
//         )
//     }
// }

// user detail action here
// export const UserDetailMethod = (data, successCallBack, failureCallBack) => {
//     return async dispatch => {
//         await _APi._post(
//             data,
//             success => {
//                 if (success?.data?.status === 'success') {
//                     // console.log('success in userDetail api', success);
//                     dispatch({
//                         type: LOGIN,
//                         payload: success?.data?.user
//                     });
//                     successCallBack()
//                 } else {
//                     failureCallBack()
//                     // Toast.show(success?.data?.message);
//                 }
//             },
//             () => {
//                 failureCallBack()
//             }
//         )
//     }
// }
// export const UploadReceipt = (data, successCallBack, failureCallBack) => {
//     return async dispatch => {
//         await _APi._post(
//             data,
//             success => {
//                 if (success?.data?.status === 'success') {
//                     console.log('success in upload Recipt========>', success?.data)

//                     successCallBack()
//                 } else {
//                     failureCallBack()
//                     console.log('fail in upload Recipt========>', success?.data)

//                     // Toast.show(success?.data?.message);
//                 }
//             },
//             () => {
//                 failureCallBack()
//             }
//         )
//     }
// }

// update device token here
// export const UpdateDeviceTokenMethod = (
//     data,
//     successCallBack,
//     failureCallBack,
// ) => {
//     return async dispatch => {
//         await _APi._post(
//             data,
//             success => {
//                 if (success?.data?.status === 'success') {
//                     console.log('success save device token', success)
//                     successCallBack()
//                 } else {
//                     failureCallBack()
//                     // Toast.show(success?.data?.message);
//                 }
//             },
//             () => {
//                 failureCallBack()
//             }
//         )
//     }
// }

// update password  here
export const ChangePasswordMethod = (
    data,
    successCallBack,
    failureCallBack
) => {
    return async () => {
        await _APi._post(
            data,
            success => {
                if (success?.data?.status === 'success') {
                    console.log('success change password', success)
                    // Toast.show(success?.data?.message);
                    successCallBack()
                    alert(success?.data?.message)

                } else {
                    failureCallBack()
                    alert(success?.data?.message)

                    // Toast.show(success?.data?.message);
                }
            },
            () => {
                failureCallBack()
            }
        )
    }
}

// check token method  here
// export const CheckTokenMethod = (data, func) => {
//     return async dispatch => {
//         await _APi._post(
//             data,
//             success => {
//                 // console.log('success check token', success);
//             },
//             code => {
//                 if (code === 401) {
//                     func()
//                     // AsyncStorage.removeItem('userDetail').then(() => {
//                     //     resetRoot('AuthStackScreen');
//                     // });
// localStorage.removeItem('userDetail').then(() => {
//     resetRoot('AuthStackScreen');
// });
//                 }
//             }
//         )
//     }
// }
