import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const DefaultRoute = '/login'

// ** Merge Routes
const Routes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: false
    }
  },
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/ChatList',
    component: lazy(() => import('../../views/Chatlist'))
  },
  {
    path: '/ChatScreen',
    component: lazy(() => import('../../views/ChatScreen'))
  },
  {
    path: '/news',
    component: lazy(() => import('../../views/News'))
  },
  {
    path: '/subscription',
    component: lazy(() => import('../../views/Subscription'))
  },
  {
    path: '/ChangePassword',
    component: lazy(() => import('../../views/ChangePassword'))
  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage'))
  },

  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
