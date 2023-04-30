import { combineReducers } from 'redux'
import AuthReducer from './AuthReducer'
import ChannelReducer from './ChannelReducer'
import NewsReducer from './NewsReducer'
export default combineReducers({
  Auth: AuthReducer,
  Channel: ChannelReducer,
  News: NewsReducer
})
