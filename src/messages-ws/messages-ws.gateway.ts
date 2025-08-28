import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    this.messagesWsService.registerClient(client);
    const connectedClients = this.messagesWsService.getConnectedClients();
    this.wss.emit('clients-updated', connectedClients);
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
    const connectedClients = this.messagesWsService.getConnectedClients();
    this.wss.emit('clients-updated', connectedClients);
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    this.wss.emit('message-from-server', {
      fullName: client.id,
      message: payload.message,
    });
  }
}
