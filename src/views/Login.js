/** @format */

import InputPasswordToggle from "@components/input-password-toggle"
// import { useSkin } from "@hooks/useSkin"
import "@styles/react/pages/page-authentication.scss"
import { useHistory } from "react-router-dom"
import Spinner from '../@core/components/spinner/Fallback-spinner'
import {
  Button, CardText, CardTitle, Col, Form, Input, Label, Row
} from "reactstrap"
import { useDispatch, useSelector } from 'react-redux'
// import { useDispatch } from 'react-redux'
import React, { useEffect, useState } from "react"
import { get_channels, login } from '../config/apiActions'
import { LoginApiMethod } from '../redux/action/AuthAction'
import { GetChannelListMethod } from "../redux/action/ChannelAction"
import { ref, onValue, set } from "firebase/database"
import { database } from "../firebase/config"

const LoginCover = () => {

  const history = useHistory()
  const { innerWidth, innerHeight } = window
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  // const [email, setEmail] = useState("waqas@o16-labs.com")
  // const [password, setPassword] = useState("Abcd!234#Abcd!234")
  // const [email, setEmail] = useState("testhardy@yopmail.com")
  // const [password, setPassword] = useState("Shahmoiz1-")
  const dispatch = useDispatch()
  const { channelList } = useSelector(state => state?.Channel)
  console.log("channel list=====>", channelList)
  const [loader, setLoader] = useState(false)


  // get channel method define here
  const getChannels = () => {
    const action = get_channels
    dispatch(
      GetChannelListMethod(
        { action },
        () => { },
        () => { }
      )
    )
  }
  useEffect(() => {

    // const data = {
    //   action: login,
    //   user_login: "o16labs@gmail.com",
    //   user_password: "6t5JiSyV#(49dsX*7Yfj*WhB"

    // }
    // axios.get("https://boilerroomtrades.com/wp-admin/admin-ajax.php", { params: { data } }).then((res) => {
    //   console.log("response===>", res)

    // }).catch((e) => {
    //   console.log("error", e)
    // })

    getChannels()

  }, [])


  const userLoginDetail = async () => {
    setLoader(true)
    const data = {
      action: login,
      user_login: email,
      user_password: password

    }

    dispatch(
      LoginApiMethod(
        data,
        async apiData => {
          console.log("api Data=======", apiData)

          history.push("/home", { apiData })
          setLoader(false)
          const getmsgs = ref(database, `users/${apiData?.id}`)
          onValue(getmsgs, (snapShot) => {
            if (snapShot.val() === null) {
              set(getmsgs, {
                name: apiData?.name,
                role: apiData?.role,
                user_id: apiData?.id
              })
            }
          })

          channelList?.map((item) => {

            const getmsgs = ref(database, `channels/${item?.type}/${item?.channel_id}/members/${apiData?.id}/`)
            set(getmsgs, {
              name: apiData?.name,
              notification_status: 1,
              role: apiData?.role,
              un_read_count: 0,
              user_id: apiData?.id,
              last_message: ''
            }
            )
          })
        }
        ,
        () => {

          setLoader(false)
        }
      )
    )
  }


  const submitLoginDetail = () => {
    // if (fieldError || (fieldError2 && !email?.length) || !password?.length) {
    //   // Toast.show(labels.plzAllFieldsAreRequired);
    // } else {
    // navigation.navigate('TabStackScreen');
    userLoginDetail()
    // }
  }

  // const illustration = skin === "dark" ? "login-v2-dark.svg" : "login-v2.svg",
  const source = require(`@src/assets/images/logo/logo_symbol@3x.png`)

  return (
    <div className='auth-wrapper auth-cover'>
      {loader ? <div style={{ width: innerWidth, height: innerHeight }}> <Spinner /></div> : <Row className='auth-inner m-0'>
        {/* <Link className='brand-logo' to='/' onClick={(e) => e.preventDefault()}>

        <h2 className='brand-text text-primary ms-1'>Boiler Room Traders</h2>
      </Link> */}
        <Col
          className='d-none d-lg-flex align-items-center p-5'
          lg='6' sm='6'>
          <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'
          >
            <img
              className='img-fluid rounded-3'
              src={source} alt='Login Cover' />
          </div>
        </Col>
        <Col
          className='d-flex align-items-center auth-bg px-2 p-lg-5'
          lg='6'
          sm='12'
        >
          <Col className='px-xl-2 mx-auto' sm='6' lg='6'  >
            <CardTitle tag={"h4"} className='mb-1 d-flex align-items-center ' style={{ justifyContent: "center" }}>
              {/* <div>
                <img style={{ maxWidth: 80 }} src={require("@src/assets/images/logo/logo_symbol@3x.png")} draggable={false} alt="logo" />

              </div> */}

              <b>Welcome</b>&ensp;to Saiyan Stocks
            </CardTitle>
            <CardText className='fw-bold mb-1 d-flex align-items-center flex-column' style={{ textAlign: "center" }} >
              Please enter your email and password to login
            </CardText>
            <Form
              className='auth-login-form mt-2'
              onSubmit={(e) => e.preventDefault()}
            >
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input
                  type='email'
                  id='login-email'
                  placeholder='john@example.com'
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {email === "" && <text style={{ color: "red", marginTop: "10px", fontSize: "12px" }}>Kindly Enter Email</text>}
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  {/* <a href="https://boilerroomtrades.com/my-account/lost-password/" target={"_blank"}>
                    <small>Forgot Password?</small>
                  </a> */}
                </div>
                <InputPasswordToggle
                  className='input-group-merge'
                  id='login-password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}

                />
                {password === "" && <text style={{ color: "red", marginTop: "10px", fontSize: "12px" }}>Kindly Enter Password</text>}

              </div>
              <div className='mb-1' style={{ textAlign: "end" }}>
                {/* <Input type='checkbox' id='remember-me' /> */}
                <a href="https://saiyanstocks.com/my-account/lost-password/" target={"_blank"}>
                  <small>Forgot Password?</small>
                </a>
              </div>
              {/* <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div> */}
              <Button color='primary' block onClick={() => {
                if (email !== null && email !== "" && password !== null && password !== "") {
                  submitLoginDetail()
                } else if (email === null) {
                  setEmail("")
                } else if (password === null) {
                  setPassword("")
                } else {
                  setPassword("")
                  setEmail("")
                }

              }
              }>
                Login
              </Button>
            </Form>
            <p className='text-center mt-2'>
              <span className='me-25'>New on our platform?</span>
              <a href="https://saiyanstocks.com/login/" target={"_blank"}>
                <span>Create an account</span>
              </a>
            </p>

          </Col>
        </Col>
      </Row>
      }
    </div >
  )
}
export default LoginCover
