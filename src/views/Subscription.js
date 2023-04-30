import React, { Fragment, useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardTitle, Button, CardGroup, CardImg, CardSubtitle } from 'reactstrap'

const Subscription = () => {
    const user = JSON.parse(localStorage.getItem("userDetail"))
    console.log("user subscription====>", user)
    const [subsActive, setSubsActive] = useState(false)
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
    useEffect(() => {
        CheckSubcription()
    }, [])


    return (
        <Fragment>
            <CardGroup >

                <Card style={{ CardalignItems: "center", justifyContent: "center" }}>
                    {subsActive ? <div>
                        <CardImg
                            style={{
                                width: "500px", height: "400px"
                            }}
                            alt="Card image cap"
                            src={require(`@src/assets/images/pages/subscription_expired@3x.png`)}
                            // top
                            width="100%"
                        />
                        <CardTitle tag="h5" style={{ textAlignLast: "center" }}>
                            Already subscribed
                        </CardTitle>
                    </div> : <> <CardImg style={{ width: "500px", height: "400px" }}
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
                    </>
                    }
                </Card>
            </CardGroup>
        </Fragment >
    )
}
export default Subscription