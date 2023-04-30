import React from 'react'

// import { MessageBox } from 'react-chat-elements/native'
// MessageBox component
import { ChatItem, ChatList, MessageBox } from 'react-chat-elements'
// import { MessageBox } from 'react-chat-elements'
export default function Chatlist() {
    return (
        <div>
            <ChatItem
                avatar={'https://facebook.github.io/react/img/logo.svg'}
                alt={'Reactjs'}
                title={'Facebook'}
                subtitle={'What are you doing?'}
                date={new Date()}
                unread={0}
            />
            <ChatList
                className='Meeting-list '
                dataSource={[
                    {
                        avatar: 'https://picsum.photos/200/300?grayscale',
                        alt: 'Reactjs',
                        title: 'Facebook',
                        subtitle: 'What are you doing?',
                        date: new Date(),
                        unread: 0
                    }

                ]} />
            <MessageBox
                position={'left'}
                type={'text'}
                text={'react.svg'}
                data={{
                    uri: 'https://facebook.github.io/react/img/logo.svg',
                    status: {
                        click: false,
                        loading: 0
                    }
                }}
            />
        </div>
    )
}
