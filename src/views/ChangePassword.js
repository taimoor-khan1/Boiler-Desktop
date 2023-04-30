import { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Col, Form, FormGroup, Input, Label } from 'reactstrap'
import { change_password } from '../config/apiActions'
import { ChangePasswordMethod } from "../redux/action/AuthAction"
import Spinner from '../@core/components/spinner/Fallback-spinner'


export default function ChangePassword() {
  const dispatch = useDispatch()
  const { innerWidth, innerHeight } = window
  const [oldPassword, setOldPassword] = useState(null)
  const history = useHistory()
  const [confirmPassword, setConfirmPassword] = useState(null)
  const user = JSON.parse(localStorage.getItem("userDetail"))
  const [loader, setLoader] = useState(false)


  const onChangePassword = () => {

    const data = {
      action: change_password,
      user_login: user?.email,
      user_password: oldPassword,
      new_password: confirmPassword
    }

    dispatch(
      ChangePasswordMethod(
        data,
        () => {
          setLoader(false)
          history.push("/home")
        },
        () => {
          setLoader(false)

        }
      )
    )
  }

  return (

    <Fragment >
      {loader === true ? <div style={{ width: innerWidth * .8, height: innerHeight * .8 }}><Spinner /></div> : <Form>
        <FormGroup row>
          <Label
            for="password"
            size="lg"
            sm={1} >
            Old Password
          </Label>
          <Col sm={8}>
            <Input
              bsSize="lg"
              id="password"
              required="kindly Enter Old Password"
              name="email"
              value={oldPassword}
              placeholder="Old Password"
              type="password"
              onChange={e => {

                setOldPassword(e.target.value)
              }}
            />
            {oldPassword === "" && <text style={{ color: "red", marginTop: "10px" }}>Kindly Enter Old Password</text>}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label
            for="confirmPassword"
            sm={1}
          >
            Confirm Password
          </Label>
          <Col sm={8}>
            <Input
              size="lg"
              id="confirmPassword"
              required="kindly Enter new password"
              name="email"
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value)
              }}
            />
            {confirmPassword === "" && <text style={{ color: "red", marginTop: "10px" }}>Kindly Enter New Password</text>}

          </Col>
        </FormGroup>
        <Button
          color="primary"
          onClick={() => {
            if (oldPassword !== null && oldPassword !== "" && confirmPassword !== null && confirmPassword !== "") {
              setLoader(true)
              onChangePassword()
            } else {
              setOldPassword("")
              setConfirmPassword("")
            }
          }}
        >
          Submit
        </Button>
      </Form>
      }

    </Fragment >
  )

}
