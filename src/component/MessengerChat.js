import React, { Component } from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

export default class MessengerChat extends Component {
    render() {
        return (
            <FacebookProvider appId="924883292758885" chatSupport>
                <CustomChat pageId="277034358822420" minimized={true} />
            </FacebookProvider>
        );
    }
}