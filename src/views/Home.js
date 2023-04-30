import { Link, useHistory } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'
import 'react-chat-elements/dist/main.css'
import { ref, onValue, orderByChild, query, limitToLast } from "firebase/database"
import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, CardImg, CardSubtitle } from 'reactstrap'
import { database } from '../firebase/config'
import moment from 'moment'

const Home = (props) => {
  const { location } = props

  const user = JSON.parse(localStorage.getItem("userDetail"))
  const [userId, setUserId] = useState('')
  const { innerHeight } = window
  const [selectedTab, setSelectedTab] = useState(location?.state?.channel)
  const [freeChannels, setFreeChannels] = useState([])
  const [paidChannels, setPaidChannels] = useState([])
  // const [messages, setMessages] = useState([])

  const [subsActive, setSubsActive] = useState(false)
  const history = useHistory()
  const checkUserDetail = () => {
    setUserId(user?.id)
  }

  const CheckSubcription = () => {
    if (user?.role === "administrator") {
      setSubsActive(true)
    } else {
      if (
        user?.user_current_membership === '' &&
        !user?.user_subscription_status &&
        !user?.iap_active
      ) {
        setSubsActive(false)
      } else {
        setSubsActive(true)
      }

    }

  }
  const getChannelsFromFirebase = async () => {
    const channelFree = ref(database, `channels/free`)
    const channelPaid = ref(database, `channels/paid`)
    onValue(channelFree, (snapShot) => {
      const freeArray = []
      snapShot.forEach(child => {
        freeArray.push({ ...child.val(), id: child.key })
      })
      setFreeChannels(freeArray)
    })
    onValue(channelPaid, (snapShot) => {
      const paidArray = []
      snapShot.forEach(child => {
        paidArray.push({ ...child.val(), id: child.key })
      }, { onlyOnce: true })
      setPaidChannels(paidArray)
    })


    // freeChannels.map(async (item) => {
    //   const UserTimeStamp = ref(database, `channels/free/${item?.id}/Users/${user?.id}`)
    //   let SaveUserTimeStamp = {}

    //   await onValue(UserTimeStamp, (snapShot) => {
    //     SaveUserTimeStamp = snapShot.val()
    //     console.log(SaveUserTimeStamp?.timestamp)
    //   })
    //   const OrderByRef = ref(database, `channels/free/${item?.id}/messages`)
    //   const orderedDbRef = query(OrderByRef, orderByChild('timestamp'))
    //   let countUnreadMessages = []
    //   // const orderedDbRef = orderByChild(OrderByRef, "timestamp")
    //   await onValue(orderedDbRef, (snapShot) => {
    //     const messagesArray = []
    //     snapShot.forEach(function (child) {
    //       messagesArray?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
    //     })
    //     countUnreadMessages = messagesArray.filter((item) => item.timestamp >= SaveUserTimeStamp?.timestamp)
    //     console.log("countUnreadMessagescountUnreadMessages", countUnreadMessages.length)

    //   })
    // })
  }
  // const UnreadCuntMethod = async () => {
  //   freeChannels.map(async (item) => {
  //     const UserTimeStamp = ref(database, `channels/free/${item?.id}/Users/${user?.id}`)
  //     let SaveUserTimeStamp = {}
  //     const tempArray = []
  //     await onValue(UserTimeStamp, (snapShot) => {
  //       SaveUserTimeStamp = snapShot.val()
  //       console.log(SaveUserTimeStamp?.timestamp)
  //       setSaveTime(SaveUserTimeStamp?.timestamp)
  //     })
  //     const OrderByRef = ref(database, `channels/free/${item?.id}/messages`)
  //     const orderedDbRef = query(OrderByRef, orderByChild('timestamp'))
  //     let countUnreadMessages = []
  //     // const orderedDbRef = orderByChild(OrderByRef, "timestamp")
  //     await onValue(orderedDbRef, (snapShot) => {
  //       const messagesArray = []
  //       snapShot.forEach(function (child) {
  //         messagesArray?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
  //       })
  //       countUnreadMessages = messagesArray.filter((item) => item.timestamp >= SaveUserTimeStamp?.timestamp)
  //       tempArray.push(countUnreadMessages)
  //       setunReadCountData([...tempArray])
  //     })
  //   })
  //   console.log("setunread", unReadCountData)
  // }

  useEffect(() => {

    if (userId !== '') {
      getChannelsFromFirebase()
      // UnreadCuntMethod()
    }
  }, [userId])
  useEffect(() => {
    if (location?.state?.channel === undefined) {
      setSelectedTab("freeChannels")
    }
    checkUserDetail()
    CheckSubcription()
    // UnreadCuntMethod()

  }, [])

  return (
    <Fragment>
      <Card
        style={{ height: innerHeight * .7 }}
        className="my-2 vh-100"
        outline
      >
        <CardHeader>
          <div className='d-flex justify-content-end w-100  '>
            <div className='d-flex gap-1'>
              <Button.Ripple color={selectedTab === "freeChannels" ? 'primary' : "white"} size='lg' className={selectedTab === "freeChannels" ? 'px-4 rounded' : "shadow-lg px-4"} onClick={() => {
                setSelectedTab("freeChannels")
              }}>Free</Button.Ripple>
              <Button.Ripple
                color={selectedTab !== "freeChannels" ? 'primary' : "white"} size='lg' className={selectedTab !== "freeChannels" ? 'px-4 rounded' : "shadow-lg px-4"}
                // color='white' className='shadow-lg px-4' size='lg'
                onClick={() => {
                  // if (!subsActive) {
                  //   history.push("/subscription")
                  // } else {
                  //   setSelectedTab("paidChannels")
                  // }
                  setSelectedTab("paidChannels")

                }}>Paid</Button.Ripple>

            </div>
          </div>
        </CardHeader>
        {selectedTab === "freeChannels" ? freeChannels.map((item) => {

          const LastMSgRef = ref(database, `channels/free/${item?.id}/messages`)
          const orderBy = query(LastMSgRef, orderByChild('timestamp'), limitToLast(1))
          const lastMsgArry = []
          onValue(orderBy, (snapShot) => {
            snapShot.forEach(function (child) {
              lastMsgArry?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
            })
          })
          console.log("lastMsgArrylastMsgArry", lastMsgArry[0])
          const UserTimeStamp = ref(database, `channels/free/${item?.id}/Users/${user?.id}`)
          let SaveUserTimeStamp = {}
          let countUnreadMessages = {}
          onValue(UserTimeStamp, (snapShot) => {
            SaveUserTimeStamp = snapShot.val()
            console.log(SaveUserTimeStamp?.timestamp)
          }, { onlyOnce: true })
          const OrderByRef = ref(database, `channels/free/${item?.id}/messages`)
          const orderedDbRef = query(OrderByRef, orderByChild('timestamp'))
          onValue(orderedDbRef, (snapShot) => {
            const messagesArray = []
            snapShot.forEach(function (child) {
              messagesArray?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
            })
            countUnreadMessages = messagesArray.filter((item) => item.timestamp >= SaveUserTimeStamp?.timestamp)
            console.log("countUnreadMessagescountUnreadMessages", countUnreadMessages.length)

          }, { onlyOnce: true })
          console.log("lastMsgArry[0]lastMsgArry[0]lastMsgArry[0]", lastMsgArry[0]?.type)
          return (
            <div className="rce-container-citem" tag={Link} to={"/ChatScreen"}
              onClickCapture={() => {
                history.push("/ChatScreen", item)
              }}
            >
              <div className="rce-citem">
                <div className="rce-citem-avatar">
                  <div className="rce-avatar-container circle large">
                    <img alt="Free Channels" src={require(`@src/assets/images/logo/channel_logo.png`)} className="rce-avatar" /></div></div>
                <div className="rce-citem-body"><div className="rce-citem-body--top">
                  <div className="rce-citem-body--top-title">{item?.name}</div>
                  {/* <div className="rce-citem-body-right" style={{ color: "gray" }}>{item?.members[userId]?.timestamp !== undefined ? moment(item?.members[userId]?.timestamp).fromNow() : ''}</div> */}
                  <div className="rce-citem-body-right" style={{ color: "gray" }}>{moment(lastMsgArry[0]?.timestamp).fromNow()}</div>
                </div>
                  <div className="rce-citem-body--bottom">
                    {/* <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>{item?.members !== undefined ? item?.members[userId]?.last_message : ''}</div> */}
                    {lastMsgArry[0]?.type === "image" ? <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>Attachment</div> : <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>{lastMsgArry[0]?.message}</div>
                    }
                    {/* <div className="rce-citem-body-right rounded-circle" style={{ backgroundColor: item?.members[userId]?.un_read_count !== 0 && "#F26A36", width: 20, height: 20, textAlign: "center", color: "white" }} >
                      {item?.members[userId]?.un_read_count !== undefined && (item?.members[userId]?.un_read_count !== 0 ? item?.members[userId]?.un_read_count : '')}
                    </div> */}
                    <div className="rce-citem-body-right rounded-circle" style={{ backgroundColor: countUnreadMessages?.length >= 1 && "#F26A36", width: 20, height: 20, textAlign: "center", color: "white" }} >
                      {countUnreadMessages.length >= 1 ? countUnreadMessages.length : ""}
                    </div>
                    <div className="rce-citem-body--bottom-tools"></div><div className="rce-citem-body--bottom-tools-item-hidden-hover">
                    </div><div className="rce-citem-body--bottom-status"></div></div></div></div></div>
          )
        }) : subsActive ? paidChannels.map((item) => {
          const LastMSgRef = ref(database, `channels/paid/${item?.id}/messages`)
          const orderBy = query(LastMSgRef, orderByChild('timestamp'), limitToLast(1))
          const lastMsgArry = []
          onValue(orderBy, (snapShot) => {
            snapShot.forEach(function (child) {
              lastMsgArry?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
            })
          })
          console.log("lastMsgArrylastMsgArry", lastMsgArry[0])
          const UserTimeStamp = ref(database, `channels/paid/${item?.id}/Users/${user?.id}`)
          let SaveUserTimeStamp = {}
          let countUnreadMessages = {}
          onValue(UserTimeStamp, (snapShot) => {
            SaveUserTimeStamp = snapShot.val()
            console.log(SaveUserTimeStamp?.timestamp)
          }, { onlyOnce: true })
          const OrderByRef = ref(database, `channels/paid/${item?.id}/messages`)
          const orderedDbRef = query(OrderByRef, orderByChild('timestamp'))
          onValue(orderedDbRef, (snapShot) => {
            const messagesArray = []
            snapShot.forEach(function (child) {
              messagesArray?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
            })
            countUnreadMessages = messagesArray.filter((item) => item.timestamp >= SaveUserTimeStamp?.timestamp)
            console.log("countUnreadMessagescountUnreadMessages", countUnreadMessages.length)

          }, { onlyOnce: true })
          return (
            <div className="rce-container-citem" tag={Link} to={"/ChatScreen"}
              onClickCapture={() => {
                history.push("/ChatScreen", item)
              }}
            >
              <div className="rce-citem">
                <div className="rce-citem-avatar">
                  <div className="rce-avatar-container circle large">
                    <img alt="Free Channels" src={require(`@src/assets/images/logo/channel_logo.png`)} className="rce-avatar" /></div></div>
                <div className="rce-citem-body"><div className="rce-citem-body--top">
                  <div className="rce-citem-body--top-title">{item?.name}</div>
                  {/* <div className="rce-citem-body-right" style={{ color: "gray" }}>{item?.members[userId]?.timestamp !== undefined ? moment(item?.members[userId]?.timestamp).fromNow() : ''}</div> */}
                  <div className="rce-citem-body-right" style={{ color: "gray" }}>{moment(lastMsgArry[0]?.timestamp).fromNow()}</div>
                </div>
                  <div className="rce-citem-body--bottom">
                    {/* <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>{item?.members !== undefined ? item?.members[userId]?.last_message : ''}</div> */}
                    {lastMsgArry[0]?.type === "image" ? <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>Attachment</div> : <div className="rce-citem-body--bottom-title" style={{ color: "gray" }}>{lastMsgArry[0]?.message}</div>
                    }
                    {/* <div className="rce-citem-body-right rounded-circle" style={{ backgroundColor: item?.members[userId]?.un_read_count !== 0 && "#F26A36", width: 20, height: 20, textAlign: "center", color: "white" }} >
                      {item?.members[userId]?.un_read_count !== undefined && (item?.members[userId]?.un_read_count !== 0 ? item?.members[userId]?.un_read_count : '')}
                    </div> */}
                    <div className="rce-citem-body-right rounded-circle" style={{ backgroundColor: countUnreadMessages?.length >= 1 && "#F26A36", width: 20, height: 20, textAlign: "center", color: "white" }} >
                      {countUnreadMessages.length >= 1 ? countUnreadMessages.length : ""}
                    </div>
                    <div className="rce-citem-body--bottom-tools"></div><div className="rce-citem-body--bottom-tools-item-hidden-hover">
                    </div><div className="rce-citem-body--bottom-status"></div></div></div></div></div>
          )
        }) : <Card style={{ CardalignItems: "center", justifyContent: "center" }}>
          <CardImg style={{ width: "500px", height: "400px", alignSelf: "center" }}
            alt="Card image cap"
            src={require(`@src/assets/images/pages/subscription_expired@3x.png`)}
          />
          <CardBody>
            <CardTitle tag="h5" style={{ textAlignLast: "center" }}>
              Subscription Expired!
            </CardTitle>
            <CardSubtitle
              style={{ textAlignLast: "center" }}
              className="mb-2 text-muted"
              tag="h6"
            >
              Your subscription has been expired let's upgrade
            </CardSubtitle>
            <div style={{ width: "100%", textAlignLast: "center" }}>
              <a href='https://saiyanstocks.com/memberships/' target={"_blank"} >
                <Button.Ripple color='primary' size='lg' className='px-4 rounded' >Upgrade</Button.Ripple>
              </a>
            </div>
          </CardBody>
        </Card>
        }
      </Card>
    </Fragment>
  )
}

export default Home

