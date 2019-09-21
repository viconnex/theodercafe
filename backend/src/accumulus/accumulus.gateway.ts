import { WebSocketGateway, OnGatewayConnection, SubscribeMessage, WsResponse } from '@nestjs/websockets';
import { Client } from 'socket.io';

@WebSocketGateway(4002)
export class AccumulusGateway implements OnGatewayConnection {
    @SubscribeMessage('events')
    handleConnection(client: Client, data: string): WsResponse {
        console.log('connection data', data);
        client.server.emit('nuage', 'voyage');
        return { event: 'events', data: 'réponse' };
    }
    @SubscribeMessage('upload')
    handleUpload(client: Client, data: string): void {
        console.log('upload data', data);
        client.server.emit('upload', data);
    }
}
