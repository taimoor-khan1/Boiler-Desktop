
import { Fragment, useState, useEffect } from 'react'
import { GetNewsMethod } from "../redux/action/NewsAction"
import { Card, CardHeader, CardBody, CardTitle, CardText, CardLink, Button, CardGroup, CardImg, CardSubtitle } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { get_news } from '../config/apiActions'
import Spinner from '../@core/components/spinner/Fallback-spinner'

const News = () => {
  const dispatch = useDispatch()
  const { newsList } = useSelector(state => state?.News)
  const [news, setNews] = useState([])
  const [loader, setLoader] = useState(true)
  const { innerWidth, innerHeight } = window
  console.log("loader", loader)
  console.log("newsList==========>", newsList)
  const icon = require("@src/assets/images/logo/logo_symbol.png")


  const fetchAllNewsMethod = () => {
    const data = {
      action: get_news
    }
    dispatch(
      GetNewsMethod(
        data,
        () => {
          setLoader(false)
        },
        () => {
          setLoader(false)
        }
      )
    )
  }
  useEffect(() => {
    fetchAllNewsMethod()
  }, [])

  // its run when newsList update
  useEffect(() => {
    const mappedOut = newsList?.map((item) => {
      return {
        ...item,
        link_object: JSON.parse(JSON.stringify(item?.link_object))
      }
    })
    setNews(mappedOut)
  }, [newsList])

  return (
    <Fragment>
      {loader ? (<div style={{ width: innerWidth * .8, height: innerHeight * .8 }}> <Spinner /></div>) : <CardGroup >
        {news?.length ? news.map((item) => {
          const str = item?.link_object.toString()
          const finalData = str.replace(/\\/g, '')
          const linkObject = JSON.parse(finalData)
          console.log("linkObjectlinkObjectlinkObjectlinkObject", linkObject)
          return (
            <Card style={{ marginRight: innerWidth * .02 }}>
              <img
                alt="Card image cap"
                src={linkObject?.image !== undefined ? linkObject?.image?.url : icon
                }
                // top
                width="100%"
              />
              <CardBody>
                <CardTitle tag="h5">
                  {linkObject?.title}
                </CardTitle>
                <a href={item?.news_link} target="_blank">
                  <CardSubtitle
                    className="mb-2 text-muted"
                    tag="h6"
                  >
                    {item?.news_link}
                  </CardSubtitle>
                </a>
                <CardText>
                  {item?.description}
                </CardText>
                <CardText>
                  {linkObject?.description}
                </CardText>

              </CardBody>
            </Card>
          )
        }) : <div></div>}
      </CardGroup>
      }
    </Fragment>
  )
}
export default News

