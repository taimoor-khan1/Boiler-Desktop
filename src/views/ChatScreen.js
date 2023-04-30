import React, { Fragment, useEffect, useState } from 'react'
import 'react-chat-elements/dist/main.css'
import { uploadBytesResumable, getDownloadURL, ref as storeref } from "firebase/storage"
import { ref, onValue, update, orderByChild, query, off, push, remove } from "firebase/database"
import { database, Timestamp, storage } from "../firebase/config"
import { LinkPreview } from '@dhaiwat10/react-link-preview'
import { isValidUrl } from '../config/Utility'
import data from '@emoji-mart/data'
import EmojiPicker from 'emoji-picker-react'
import Picker from '@emoji-mart/react'
import moment from 'moment/moment'
import { MdReply, MdOutlineDeleteOutline, MdOutlineEmojiEmotions, MdModeEditOutline, MdCancel, MdMoreHoriz } from "react-icons/md"
import { Card, Button, InputGroup, Input, CardText, Modal } from 'reactstrap'
import {
    GetChannelNotificationStatusMethod,
    SendMessageDone,
    SendMessageNotificationMethod
} from '../redux/action/ChannelAction'
import { get_channel_notification_status, send_notification } from '../config/apiActions'
import { useDispatch } from 'react-redux'
import colors from '../assets/colors'
import { useHistory } from 'react-router-dom'
// import axios from 'axios'
export default function ChatScreen(props) {
    const { location } = props
    new Picker({ data })
    const { innerHeight } = window
    const history = useHistory()
    const channelType = location?.state?.type
    const dispatch = useDispatch()
    const [modalIsOpen, setIsOpen] = useState(false)
    const [isSwitch, setISSwitch] = useState(false)
    const members = location?.state?.members
    const timeStamp1 = Timestamp.now().toMillis()
    const [showReactions, setShowReactions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [selectedIndex1, setSelectedIndex1] = useState(null)
    const [showReply, setShowReply] = useState(false)
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState("")
    const [membersArray, setMembers] = useState([])
    const [showEmojis, setShowEmojis] = useState(false)
    const [resplyRefDetail, setReplyRefDetail] = useState(null)
    const [imageCaptionModal, setImageCaptionModal] = useState(false)
    const [selectedImage, setSelectedImage] = useState('')
    const [selectedImagePreview, setSelectedImagePreview] = useState('')
    const [selectedImageName, setSelectedImageName] = useState('')
    const [captionText, setCaptionText] = useState('')
    const [editMessage, setEditMessage] = useState(null)
    const [autoFocus, setAutoFocus] = useState(false)
    console.log(imageCaptionModal, isSwitch, autoFocus, membersArray)
    const user = JSON.parse(localStorage.getItem("userDetail"))
    const getReacts = reacts => {
        const array = []
        for (const key in reacts) {
            reacts[key].user_id = key
            array.push(reacts[key])
        }
        return array
    }
    const onImageSportsChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedImage(event.target.files[0])
            setSelectedImageName(event.target.files[0].name)
            setSelectedImagePreview(URL.createObjectURL(event.target.files[0]))
        }
    }

    // get messages method define here
    const getAllMessagesMethod = () => {
        const getData = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages`)
        onValue(getData, snapShot => {
            const messagesArray = []
            snapShot.forEach(function (child) {
                messagesArray?.push({ ...child.val(), id: child.key })// NOW THE CHILDREN PRINT IN ORDER
            })
            const againMappedForReact = messagesArray?.map((item) => {
                if (item?.reacts !== "undefined" && item?.reacts !== undefined) {
                    return {
                        ...item,
                        reacts: getReacts(item?.reacts)
                    }
                } else {
                    return { ...item, reacts: [] }
                }
            })
            const filteredOutDeleteMessages = againMappedForReact?.filter(
                item => item?.status !== 'remove'
            )
            // setMessages(filteredOutDeleteMessages.reverse())
            setMessages(filteredOutDeleteMessages)
            setMessage("")
            setShowReply(false)
            setReplyRefDetail(null)
            setSelectedImage('')
            setCaptionText('')
            setSelectedImageName('')
            setImageCaptionModal(false)
            setAutoFocus(false)
            // const emojies = []
            const dataUpdate = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/members/${user?.id}`)
            update(dataUpdate, { un_read_count: 0 })
            const UpdateTimeStamp = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/Users/${user?.id}`)
            update(UpdateTimeStamp, { timestamp: timeStamp1 })

        })
        const snapShot2 = query(getData, orderByChild('timestamp'))
        const changeMesageObject = snapShot2
        const changeMessageId = snapShot2.key
        const reactObj = snapShot2.reacts
        const emojiArray = []
        if (reactObj === undefined && reactObj === "undefined") {
            if (changeMesageObject?.status === 'remove') {
                const messagesItem = {
                    ...changeMesageObject,
                    id: changeMessageId,
                    reacts: emojiArray
                }
                setMessages(prev => {
                    const mappedOut = prev?.map((item) => {
                        if (item?.id === changeMessageId) {
                            return messagesItem
                        } else {
                            return item
                        }
                    })
                    return [...mappedOut]
                })
            } else {
                const emojiArray = []
                if (reactObj !== undefined && reactObj !== "undefined") {
                    for (const key in reactObj) {
                        reactObj[key].user_id = key
                        emojiArray.push(reactObj[key])
                    }
                }
                const messagesItem = {
                    ...changeMesageObject,
                    id: changeMessageId,
                    reacts: emojiArray
                }

                setMessages(prevMessages => {
                    return [...prevMessages, messagesItem]
                })
                setMessage("")
                setShowReply(false)
                setReplyRefDetail(null)
                emojies = []
                const dataUpdate = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/members/${user?.id}`)
                const dataPush = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/lastMassage/`)
                push(dataPush, { user_id: user.id })
                update(dataUpdate, { timestamp: 0 })
            }
        } else {
            for (const key in reactObj) {
                reactObj[key].user_id = key
                emojiArray.push(reactObj[key])
            }
            const changeMessageItem = {
                ...changeMesageObject,
                id: changeMessageId,
                reacts: emojiArray
            }
            setMessages(prev => {
                const mappedOut = prev?.map((item) => {
                    if (item?.id === changeMessageId) {
                        return changeMessageItem
                    } else {
                        return item
                    }
                })
                return [...mappedOut]
            })
        }

        // here we get all members ids
        const dummyArray = []
        for (const key in members) {
            members[key].memberId = key
            dummyArray.push(key)
        }
        setMembers(dummyArray)
    }

    // send image in chat define here

    // delete chat item define method here
    const deleteChatItemMethod = chatId => {
        const DeleteRef = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages/${chatId}`)
        update(DeleteRef, {
            status: 'remove',
            timeStamp: timeStamp1
        }).then(() => setSelectedIndex1(null)).catch((err) => { console.log("error======>", err) })
    }

    // send emoji on selected message define here
    const sendEmojiOnMessage = (name, chatId) => {
        const sendEmoji = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages/${chatId}/reacts/${user?.id}`)
        update(sendEmoji, {
            react_type: name,
            timeStamp: timeStamp1
        }).then(() => {
            setSelectedIndex(null)
        }).catch((err) => {
            console.log("errroorrr=======>", err)
        })
    }
    // send emoji on selected message define here
    const sendEmojiUndo = chatId => {
        const removeEmoji = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages/${chatId}/reacts/${user?.id}`)
        remove(removeEmoji)
    }
    const PressOnEmoji = (emojiName, chatId, reactsLength) => {
        console.log('emojiName', emojiName)
        console.log('chatId', chatId)
        console.log('reactsLength', reactsLength)
        const findObjById = reactsLength?.find(
            item => item?.user_id === user?.id
        )
        console.log("find Obj Id========>", findObjById)
        if (findObjById?.react_type === emojiName) {
            setShowReactions(false)
            sendEmojiUndo(chatId)
        } else {
            setShowReactions(false)
            sendEmojiOnMessage(emojiName, chatId)
        }
    }
    useEffect(() => {
        setMessage("")
        setMessages([])

        const data = {
            action: get_channel_notification_status,
            user_id: user?.id,
            channel_id: location?.state?.id
        }
        dispatch(
            GetChannelNotificationStatusMethod(
                data,
                data => {
                    if (Number(data?.notification_status) === 1) {
                        setISSwitch(true)
                    } else {
                        setISSwitch(false)
                    }
                },
                () => { }
            )
        )
        global.channelId = location?.state?.id
    }, [])
    useEffect(() => {
        setMessages([])
        getAllMessagesMethod()
        return () => {
            const data = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages`)
            off(data, "value")
            off(data, "child_changed")

        }
    }, [])

    // send message to channel method define here
    const sendMessage = async (message, messageType) => {
        let messageObj = {}
        setMessage("")
        if (editMessage !== null) {
            const sendMsg = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages/${editMessage?.id}/`)
            update(sendMsg, {
                message,
                edit: true,
                timeStamp: timeStamp1
            }).then(() => {
                setShowReactions(false)
                setSelectedIndex(null)
                setEditMessage(null)
                setSelectedIndex1(null)
                setMessage("")
            }).catch(err => {
                console.log('error', err)
            })
        } else {
            if (isValidUrl(message) === true && messageType !== 'image') {
                messageObj = {
                    message: message.toLowerCase(),
                    name: user?.name,
                    status: 'active',
                    type: "url",
                    user_id: user?.id,
                    // timestamp: database.ServerValue.TIMESTAMP,
                    timestamp: timeStamp1,
                    reply_reference: "undefined",
                    reacts: "undefined",
                    linkDetail: {
                        // title: (await getPreviewData(`${message}`)).title,
                        // description: (await getPreviewData(`${message}`)).description,
                        // image: (await getPreviewData(`${message}`)).image
                        title: selectedImageName,
                        description: "",
                        image: selectedImage
                    }
                }
            } else {
                if (showReply) {
                    messageObj = {
                        message,
                        name: user?.name,
                        status: 'active',
                        type: messageType,
                        user_id: user?.id,
                        reply_reference: resplyRefDetail,
                        // timestamp: database.ServerValue.TIMESTAMP,
                        timestamp: timeStamp1,
                        reacts: "undefined",
                        linkDetail: "undefined"
                    }
                } else {
                    if (messageType === "image") {
                        (messageObj = {
                            message,
                            captionText,
                            name: user?.name,
                            status: 'active',
                            type: messageType,
                            user_id: user?.id,
                            timestamp: timeStamp1,
                            reply_reference: "undefined",
                            reacts: "undefined",
                            linkDetail: "undefined"
                        })
                    } else {
                        (messageObj = {
                            message,
                            name: user?.name,
                            status: 'active',
                            type: messageType,
                            user_id: user?.id,
                            // timestamp: database.ServerValue.TIMESTAMP,
                            timestamp: timeStamp1,
                            reacts: "undefined",
                            reply_reference: "undefined",
                            linkDetail: "undefined"
                        })
                    }
                }
            }
        }

        setMessage("")
        await push(ref(database, `channels/${location?.state?.type}/${location?.state?.id}/messages/`), messageObj)
        const data = {
            action: send_notification,
            channel_id: location?.state?.id,
            user_id: user?.id,
            message: captionText === '' ? message : captionText,
            type: captionText === '' ? messageType : 'Text'
        }

        await dispatch(
            SendMessageNotificationMethod(
                data,
                () => { },
                () => { }
            )
        )
        const UpdateTimeStamp = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/Users/${user?.id}`)
        update(UpdateTimeStamp, { timestamp: timeStamp1 })
        // try {
        //     let count = 0
        //     membersArray?.map(async (item) => {
        //         const memberData = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/members/${item}`)
        //         await onValue(memberData, snapShot => {
        //             const updateLastmessage = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/members/${item}/`)
        //             if (count <= 5000) {
        //                 if (item === user?.id) {
        //                     update(updateLastmessage, {
        //                         un_read_count: Number(snapShot.val().un_read_count) + 0,
        //                         last_message: message,
        //                         timestamp: timeStamp1
        //                     })
        //                 } else {
        //                     count = count + 1
        //                     console.log("count,", count)

        //                     update(updateLastmessage, {
        //                         un_read_count: Number(snapShot.val().un_read_count) + 1,
        //                         last_message: message,
        //                         timestamp: timeStamp1
        //                     })
        //                 }

        //             }

        //         }, { onlyOnce: true })
        //     })

        // } catch (error) {
        //     console.log("error: ", error)
        // }
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {

            if (message !== "") {
                sendMessage(message, "Text")
                setMessage("")
                setShowEmojis(false)
            } else if (selectedImage !== "") {
                sendMessage(selectedImage, "image")
                setSelectedImage("")
                setShowEmojis(false)
            } else {
                setSelectedImage("")
                setMessage("")
                setShowEmojis(false)
            }

        }
    }
    const sendImageInChatMethod = (path, name) => {
        const storageref = storeref(storage, name)
        const uploadTask = uploadBytesResumable(storageref, path)
        // const task = storageref?.putFile(path)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                setIsOpen(false)
                console.log("Percent: ", percent)
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    sendMessage(url, "image")
                    console.log("url: ", url)

                })
            }
        )
    }
    const custom = [
        {
            id: '1',
            name: "anxious_face",
            react_type: "anxious_face",
            img: require("../assets/Emojis/anxious_face@3x.png")
        }, {
            id: '2',
            name: "face_with_tear",
            react_type: "face_with_tear",
            img: require("../assets/Emojis/face_with_tears@3x.png")
        },
        {
            id: '3',
            name: "like",
            react_type: "like",
            img: require("../assets/Emojis/like@3x.png")
        },
        {
            id: '4',
            name: "heart",
            react_type: "heart",
            img: require("../assets/Emojis/heart@3x.png")
        },
        {
            id: '5',
            name: "tear",
            react_type: "tear",
            img: require("../assets/Emojis/tear@3x.png")
        }
    ]
    const customFetcher = async (url) => {
        const response = await fetch(`https://rlp-proxy.herokuapp.com/v2?url=${url}`)
        const json = await response.json()
        console.log("Json data", json)
        // return json.metadata;
    }
    return (
        <Fragment  >
            <div className='d-flex justify-content-start w-100 '>
                <div className='d-flex gap-1' style={{ justifyItems: "center", alignItems: "center", marginBottom: "10px" }}>
                    <img src={require(`@src/assets/images/icons/back.png`)}
                        onClick={() => {
                            let item = { channel: "" }
                            if (channelType === "free") {
                                item = { channel: "freeChannels" }
                            } else {
                                item = { channel: "paidChannels" }
                            }
                            const UpdateTimeStamp = ref(database, `channels/${location?.state?.type}/${location?.state?.id}/Users/${user?.id}`)
                            update(UpdateTimeStamp, { timestamp: timeStamp1 })
                            history.push("/home", item)
                        }} style={{ width: "30px", height: "30px" }} />
                    <div>
                        <img src={require(`@src/assets/images/logo/channel_logo.png`)} style={{ width: "60px", height: "60px" }} />
                    </div>
                    <h1 className=' w-100 font-weight-bold' size='lg'>{location?.state?.name}</h1>
                </div>
            </div>
            <Card
                style={{
                    display: "flex",
                    overflowy: "auto",
                    height: innerHeight * .7,
                    position: "relative"
                }}
                outline
            >
                {/* ================================================ reply================================ */}
                {showReply &&
                    <div className="shadow-lg" style={{
                        zIndex: "1000", position: "absolute", bottom: "10px", display: "flex", alignItems: "center", backgroundColor: "white", width: "100%", height: "15%", borderTopRightRadius: "15px", borderTopLeftRadius: "15px"
                    }}>
                        <div className={"rce-mbox"} style={{ backgroundColor: colors.lightGrey, borderRadius: "5px", display: "flex", width: "90%", height: "80%" }}>
                            <text style={{ color: colors.black }}>{resplyRefDetail?.message}</text>
                        </div>
                        < MdCancel style={{ alignSelf: "flex-start", marginTop: "10px" }} onClick={() => {
                            setShowReply(false)
                        }} />

                    </div>}

                {/* ================================================Show Emoji================================================ */}
                {showEmojis &&
                    <div style={{
                        zIndex: "1000", position: "absolute", bottom: "10px", right: "10px"
                    }}
                    >
                        <EmojiPicker width={"95%"} onEmojiClick={(e) => {
                            // console.log("pre msgs", message)
                            setMessage(pre => pre + e.emoji)

                        }} />
                    </div>
                }
                {/* ================================================================reply end================================================================ */}
                <p style={{
                    overflow: "auto", transform: ' rotate(180deg)', padding: '10px'
                }}>
                    <CardText
                        style={{ overflow: 'hidden', transform: ' rotate(-180deg)' }}
                    >
                        {
                            messages.map((item, index) => {
                                return (
                                    <div>
                                        {item?.message?.length > 0 &&
                                            <><div>
                                                <div style={{ display: item?.user_id === user?.id && "none" }}>
                                                    <div style={{ display: 'flex', flexDirection: "row", margin: "10px" }}>
                                                        <div style={{ backgroundColor: colors.theme_Color, width: "50px", height: "50px", alignItems: "center", justifyContent: "center", display: "flex" }} className="rounded-circle" >
                                                            <text style={{ color: colors.white, fontSize: "15px" }}>{item?.name.slice(0, 1).toUpperCase()}</text>
                                                        </div>
                                                        <div style={{ marginLeft: "10px" }}>
                                                            <div>
                                                                <text style={{ marginRight: "10px", color: item?.user_id !== user?.id && colors.black }}> <b>{item?.name}</b>  </text>
                                                            </div>
                                                            <text style={{ marginRight: "10px", color: item?.user_id !== user?.id && colors.lightGrey }}>
                                                                {item?.timestamp !== undefined ? moment(item?.timestamp).fromNow() : ''}
                                                            </text>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="rce-container-mbox"
                                                    style={{ flexDirection: "row", justifyContent: "center" }}  >
                                                    {/* Replay Section */}
                                                    {item?.reply_reference?.message &&
                                                        <div className="rce-container-mbox" style={{ marginBottom: "-10px", marginRight: "10px", marginLeft: "10px" }}>
                                                            <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right " : "rce-mbox"} style={{ backgroundColor: "whitesmoke", borderRadius: "5px" }}>
                                                                <text style={{ color: item?.user_id === user?.id ? colors.black : colors.black }}>{item?.reply_reference?.message}</text>
                                                            </div>
                                                        </div>
                                                    }
                                                    {/* ================================================================text messages================================================================ */}
                                                    {item.type === "Text" && <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right " : "rce-mbox"} style={{ backgroundColor: item?.user_id === user?.id ? colors.chatBubble : "#D3D3D3", borderRadius: "5px" }}>
                                                        <text style={{ marginRight: "10px", color: item?.user_id === user?.id ? colors.white : colors.black }}>{item?.message}</text>
                                                    </div>
                                                    }
                                                    {/* ================================================================images================================================================ */}
                                                    {item.type === "image" && <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right " : "rce-mbox"} style={{ backgroundColor: item?.user_id === user?.id ? colors.chatBubble : "#D3D3D3", borderRadius: "5px" }}>
                                                        <img style={{ marginRight: "10px", maxWidth: "300px", maxHeight: "400px" }} src={item?.message} />
                                                    </div>
                                                    }

                                                    {/* =========================================Delete | Edit | Replay Button======================= */}
                                                    {selectedIndex1 === index ? <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right" : "rce-mbox"} style={{ minWidth: "10px", marginRight: "30px", marginLeft: "30px" }}>
                                                        {user?.role === "administrator" ? <div>
                                                            <  MdOutlineDeleteOutline style={{ width: "20px", height: "20px", marginRight: "10px" }} onClick={() => {
                                                                setShowReply(false)
                                                                deleteChatItemMethod(item?.id)
                                                            }} />
                                                            {item?.user_id !== user?.id ? <  MdReply style={{ width: "20px", height: "20px", marginRight: "10px" }} onClick={() => {
                                                                setShowReply(true)
                                                                setReplyRefDetail(item)
                                                                setSelectedIndex1(null)
                                                            }} /> : item?.type !== "image" &&
                                                            <  MdModeEditOutline
                                                                onClick={() => {
                                                                    setSelectedIndex1(null)
                                                                    setEditMessage(item)
                                                                    setMessage(item?.message)
                                                                    setShowReply(false)
                                                                }}
                                                                style={{ width: "20px", height: "20px", marginRight: "10px" }} />}
                                                            <  MdOutlineEmojiEmotions style={{ width: "20px", height: "20px", marginRight: "10px" }} onClick={() => {
                                                                setSelectedIndex(index)
                                                                setShowReactions(prev => !prev)
                                                            }} />
                                                            {selectedIndex === index &&
                                                                showReactions &&
                                                                custom.map((items) => {
                                                                    return (
                                                                        <img
                                                                            onClick={() => {
                                                                                console.log("Selected Index====>", items.react_type)
                                                                                PressOnEmoji(items.react_type, item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                            style={{ width: "20px", height: "20px", marginRight: "10px" }} src={items.img} />
                                                                    )
                                                                })}
                                                        </div> : <div><  MdOutlineEmojiEmotions style={{ width: "20px", height: "20px", marginRight: "10px" }} onClick={() => {
                                                            setSelectedIndex(index)
                                                            setShowReactions(prev => !prev)
                                                        }} />
                                                            {selectedIndex === index &&
                                                                showReactions &&
                                                                custom.map((items) => {
                                                                    return (
                                                                        <img
                                                                            onClick={() => {
                                                                                console.log("Selected Index====>", items.react_type)
                                                                                PressOnEmoji(items.react_type, item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                            style={{ width: "20px", height: "20px", marginRight: "10px" }} src={items.img} />
                                                                    )
                                                                })}
                                                        </div>

                                                        }

                                                    </div> : <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right " : "rce-mbox"} style={{ minWidth: "0px", marginRight: "30px", marginLeft: "30px", borderRadius: "30px", pending: "0px" }}>
                                                        <  MdMoreHoriz style={{ width: "20px", height: "20px" }}
                                                            onClick={() => {
                                                                setSelectedIndex1(index)
                                                            }}
                                                        />
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                                {/* {item?.type === "url" &&
                                                    <LinkPreview url={item?.message} />
                                                } */}
                                                {item?.reacts?.length > 0 && <div className="rce-container-mbox mx-2 mb-2" style={{ marginTop: -10 }} >
                                                    <div className={item?.user_id === user?.id ? "rce-mbox rce-mbox-right " : "rce-mbox "} style={{ backgroundColor: colors.white, borderRadius: "20px", minWidth: "20px" }}>
                                                        <div className="" >
                                                            <div className="">
                                                                {item?.reacts?.filter(obj => obj.react_type === "anxious_face").length > 0 &&
                                                                    <>
                                                                        <img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={require("../assets/Emojis/anxious_face@3x.png")}
                                                                            onClick={() => {
                                                                                PressOnEmoji("anxious_face", item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                        />
                                                                        <text style={{ marginRight: "10px" }}>{item?.reacts?.filter(obj => obj.react_type === "anxious_face").length}</text>
                                                                    </>
                                                                }
                                                                {item?.reacts?.filter(obj => obj.react_type === "face_with_tear").length > 0 &&
                                                                    <>
                                                                        <img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={require("../assets/Emojis/face_with_tears@3x.png")}
                                                                            onClick={() => {
                                                                                PressOnEmoji("face_with_tear", item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                        />
                                                                        <text style={{ marginRight: "10px" }} >{item?.reacts?.filter(obj => obj.react_type === "face_with_tear").length}</text>
                                                                    </>

                                                                }
                                                                {item?.reacts?.filter(obj => obj.react_type === "like").length > 0 &&
                                                                    <>
                                                                        <img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={require("../assets/Emojis/like@3x.png")}
                                                                            onClick={() => {
                                                                                PressOnEmoji("like", item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                        />
                                                                        <text style={{ marginRight: "10px" }}>{item?.reacts?.filter(obj => obj.react_type === "like").length}</text>
                                                                    </>
                                                                }
                                                                {item?.reacts?.filter(obj => obj.react_type === "heart").length > 0 &&
                                                                    <>
                                                                        <img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={require("../assets/Emojis/heart@3x.png")}
                                                                            onClick={() => {
                                                                                PressOnEmoji("heart", item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                        />
                                                                        <text style={{ marginRight: "10px" }}>{item?.reacts?.filter(obj => obj.react_type === "heart").length}</text>
                                                                    </>

                                                                }
                                                                {item?.reacts?.filter(obj => obj.react_type === "tear").length > 0 &&
                                                                    < >
                                                                        <img style={{ width: "20px", height: "20px", marginRight: "10px" }} src={require("../assets/Emojis/tear@3x.png")}
                                                                            onClick={() => {
                                                                                PressOnEmoji("tear", item?.id, item?.reacts)
                                                                                setShowReactions(false)
                                                                            }}
                                                                        />
                                                                        <text style={{ marginRight: "10px" }}>{item?.reacts?.filter(obj => obj.react_type === "tear").length}</text>
                                                                    </>
                                                                }
                                                            </div></div>
                                                    </div>
                                                </div>
                                                }
                                            </>
                                        }
                                    </div>
                                )
                            })
                        }
                    </CardText>
                </p>

            </Card >
            {/* ================================================ Send Button ================================================= */}
            {user?.role === "administrator" &&
                <div style={{ marginTop: "-40px", width: "100%" }} >

                    <div style={{ width: "100%", textAlign: "-webkit-center" }}>
                        <InputGroup style={{ width: "100%", alignContent: "center", backgroundColor: "white", borderColor: colors.lightGrey }} className="border border-2 rounded">
                            <Input

                                style={{ borderColor: "white" }}
                                onKeyDown={handleKeyDown}
                                color='black' multiple={true} value={message} placeholder={"Write here "}
                                onChange={(e) => {
                                    setMessage(e?.target?.value)
                                }} />
                            <img src={require(`@src/assets/images/emoji.png`)} style={{ width: "30px", height: "30px", alignSelf: "center", marginRight: "10px" }} onClick={() => setShowEmojis(pres => !pres)} />
                            <div style={{
                                display: "inline-block",
                                position: "relative",
                                alignSelf: "center"
                            }}>

                                <img htmlFor={"file"} src={require(`@src/assets/images/image.png`)} style={{ width: "30px", height: "30px", alignSelf: "center", marginRight: "10px" }} />
                                <input type="file" accept="image/*" style={{
                                    opacity: 0,
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0
                                }}
                                    id="file"
                                    onChange={(e) => {
                                        onImageSportsChange(e)
                                        setIsOpen(true)
                                    }
                                    }

                                />
                            </div>
                            <Button.Ripple style={{}} color='primary' size='sm' className='px-2 rounded'
                                onClick={() => {
                                    if (message !== "") {
                                        sendMessage(message, "Text")
                                        setMessage("")
                                        setShowEmojis(false)

                                    } else {
                                        setMessage("")
                                        setShowEmojis(false)
                                    }
                                }}
                            >
                                Send
                            </Button.Ripple>
                        </InputGroup>


                        {/* </div> */}
                    </div>
                </div>
            }
            {/* ================================================================ Picture Upload Modal================================================================ */}
            <Modal
                style={{
                    width: '100%', height: '80%', display: 'flex'
                }}
                isOpen={modalIsOpen}
            >
                <div style={{ padding: "20px", width: "100%", height: "100%", position: "relative" }}>
                    <div style={{ margin: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h2 >Upload</h2>
                        {/* <h3 >{selectedImage}</h3> */}
                        < MdCancel style={{ alignSelf: "flex-start", marginTop: "10px", width: "20px", height: "20px" }} onClick={() => {
                            setIsOpen(false)
                        }} />
                    </div>
                    <div style={{ display: "none" }}>

                        <LinkPreview url={selectedImagePreview} fetcher={customFetcher} />
                    </div>

                    <img alt="not fount" src={selectedImagePreview} style={{ width: "90%", height: "80%", margin: "20px", resize: "block", alignSelf: "center" }} />
                    {/* <img src={require("../assets/Emojis/anxious_face@3x.png")} style={{ width: "90%", height: "40%", margin: "20px", resize: "block", alignSelf: "center" }} /> */}
                    <div style={{ width: "90%", textAlign: "-webkit-center", bottom: "10px", position: "absolute" }} >
                        <InputGroup style={{ width: "100%", alignContent: "center", backgroundColor: "white", borderColor: colors.lightGrey }} className="border border-2 rounded">
                            <Input
                                style={{ borderColor: "white" }}
                                onKeyDown={handleKeyDown}
                                color='black' multiple={true}
                                value={captionText}
                                placeholder={"Add a Caption"}
                                onChange={(e) => {
                                    setCaptionText(e?.target?.value)
                                }} />
                            <Button.Ripple style={{}} color='primary' size='sm' className='px-2 rounded'
                                onClick={() => {
                                    // sendMessage("")
                                    sendImageInChatMethod(selectedImage, selectedImageName)
                                }}
                            >
                                Send
                            </Button.Ripple>
                        </InputGroup>
                    </div>
                </div>
            </Modal>
        </Fragment >
    )
}
