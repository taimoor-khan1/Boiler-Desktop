import * as React from 'react'

export const resetRoot = routeName => {
  navigationRef.current?.resetRoot({
    index: 0,
    routes: [{ name: routeName }]
  })
}
export const navigationRef = React.createRef()
export const navigate = (routeName, params) => {
  navigationRef.current?.navigate(routeName, params)
}

export const changeStack = stackName => {
  resetRoot(stackName)
}

