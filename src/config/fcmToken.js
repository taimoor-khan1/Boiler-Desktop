import messaging from '@react-native-firebase/messaging'
import labels from '../assets/labels'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { save_device_token } from './apiActions'
import { UpdateDeviceTokenMethod } from '../store/actions/AuthAction'

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  console.log('enabled', enabled);
  if (enabled) {
    console.log('Authorization status:', authStatus)
  } else {
    await requestUserPermission()
  }
}

export const getFCMToken = async (dispatch, getData) => {
  try {
    const userDetail = await localStorage.getItem('userDetail')
    // const userDetail = await AsyncStorage.getItem('userDetail')
    requestUserPermission();

    const fcmToken = await messaging().getToken()
    console.log("FCM TOKEN=======>", fcmToken)
    if (fcmToken) {
      console.log('fcm token', fcmToken);
      getData(fcmToken);
      let data = {
        action: save_device_token,
        device_token: fcmToken,
        role: labels.admin,
        user_id: userDetail
      };
      dispatch(
        UpdateDeviceTokenMethod(
          data,
          () => { },
          () => { }
        )
      )
    } else {
      console.log('fcm token is not yet')
    }
  } catch (error) {
    console.log('catch error', error)
  }
};
