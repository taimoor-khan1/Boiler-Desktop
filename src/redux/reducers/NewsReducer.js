import { NEWS_LIST } from '../actionTypes'

const INITIAL_STATE = {
  newsList: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEWS_LIST:
      return {
        ...state,
        newsList: action.payload
      }
    default:
      return state
  }
}
