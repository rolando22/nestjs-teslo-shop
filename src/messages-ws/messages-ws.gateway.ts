import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';

import type { JwtPayload } from '@auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const jwtToken = client.handshake.headers.authentication as string;

    try {
      const payload: JwtPayload = this.jwtService.verify(jwtToken);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      console.log(error);

      client.disconnect();
      return;
    }

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
    const user = this.messagesWsService.getUserBySocketId(client.id);

    this.wss.emit('message-from-server', {
      fullName: user.fullName,
      message: payload.message,
    });
  }
}
