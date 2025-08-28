import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';

import { User } from '@auth/entities/user.entity';

import type { ConnectedClients } from './interfaces/connected-clients.interface';

@Injectable()
export class MessagesWsService {
  private connectedClients: ConnectedClients = {};

  constructor(
    @InjectRepository(User) private readonly userRespository: Repository<User>,
  ) {}

  async registerClient(client: Socket, userId: User['id']): Promise<void> {
    const user = await this.userRespository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User not active');
    }

    this.checkUserConnection(user);

    this.connectedClients[client.id] = {
      socket: client,
      user,
    };
  }

  removeClient(clientId: string): void {
    delete this.connectedClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserBySocketId(socketId: string): User {
    return this.connectedClients[socketId].user;
  }

  private checkUserConnection(user: User) {
    for (const clientId of Object.keys(this.connectedClients)) {
      const connectedClient = this.connectedClients[clientId];

      if (connectedClient.user.id === user.id) {
        connectedClient.socket.disconnect();
        // this.removeClient(clientId);
        break;
      }
    }
  }
}
