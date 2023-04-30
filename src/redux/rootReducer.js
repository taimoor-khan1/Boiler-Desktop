// ** Reducers Imports
import navbar from './navbar'
import layout from './layout'
import auth from './authentication'
import { combineReducers } from 'redux'
import AuthReducer from '../redux/reducers/AuthReducer'
import ChannelReducer from '../redux/reducers/ChannelReducer'
import NewsReducer from '../redux/reducers/NewsReducer'


export default combineReducers({
  auth,
  navbar,
  layout,
  Auth: AuthReducer,
  Channel: ChannelReducer,
  News: NewsReducer
})

// const rootReducer = {
//   auth,
//   navbar,
//   layout,
//   Auth: AuthReducer,
//   Channel: ChannelReducer,
//   News: NewsReducer
// }

// export default rootReducer
