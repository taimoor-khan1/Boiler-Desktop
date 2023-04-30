import axios from 'axios'
// import AsyncStorage from '@react-native-async-storage/async-storage';


class Api {
  constructor() {
    this.baseUrl = 'https://saiyanstocks.com/wp-admin/admin-ajax.php'
    // this.baseUrl = 'https://boilerroomtrades.com/wp-admin/admin-ajax.php'
    // this.baseUrl = ' https://saiyanstocks.com/'

  }

  async _post(obj, success, failure) {
    // const token = await AsyncStorage.getItem('token');
    // const token = await localStorage.getItem('token');
    // console.log('token', token);

    this.instance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    try {
      // console.log("params========>", obj.action)
      const res = await this.instance.get('', { params: obj })
      // console.log('this.instance', res)
      if (res !== null) {
        success(res)
      }
    } catch (error) {
      console.log('error', error)
      if (error?.response?.status === 401) {
        failure(error?.response?.status)
      }
    }
  }
}

export default new Api()
