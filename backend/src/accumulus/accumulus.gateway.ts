import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Client } from 'socket.io';
require('dotenv').config();

const origin = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://victorbrun.github.io';

@WebSocketGateway(4002, { origins: origin })
export class AccumulusGateway implements OnGatewayConnection {
    @SubscribeMessage('events')
    handleConnection(client: Client): WsResponse {
        console.log('connection');
        client.server.emit('nuage', 'voyage');
        return { event: 'events', data: 'réponse' };
    }
    @SubscribeMessage('upload')
    handleUpload(client: Client, data: string): void {
        console.log('upload data', data);
        client.server.emit('upload', data);
    }
}
