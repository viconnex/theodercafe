import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Client } from 'socket.io';
require('dotenv').config();

@WebSocketGateway(4002)
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
