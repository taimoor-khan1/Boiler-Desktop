import { LOGIN, SIGNUP } from '../actionTypes'

const INITIAL_STATE = {
  user: null
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload
      }
    case SIGNUP:
      return {
        ...state,
        user: action.payload
      }
    default:
      return state
  }
}
