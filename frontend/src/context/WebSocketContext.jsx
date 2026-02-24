import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new SockJS(`${import.meta.env.VITE_WS_URL}/ws`);
        const client = Stomp.over(socket);

        client.connect({}, () => {
            setStompClient(client);
        }, (err) => {
            console.error('Connection error: ', err);
        });

        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, []);

    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
