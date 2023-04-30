import { CHANNEL_LIST } from '../actionTypes'

const INITIAL_STATE = {
  channelList: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANNEL_LIST:
      return {
        ...state,
        channelList: action.payload
      }
    default:
      return state
  }
}
