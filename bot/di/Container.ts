import { Container } from 'inversify';
import { Types } from './Types';
import type { ChannelConfigurationRepository } from '../repositories/interfaces/ChannelConfigurationRepository';
import { PrismaChannelConfigurationRepository } from '../repositories/PrismaChannelConfigurationRepository';
import { PrismaClient } from '../../generated/prisma/client';
import prisma from '../../database/prisma';
import type { ConnectionService } from '../services/interfaces/ConnectionService';
import { ConnectionServiceImpl } from '../services/ConnectionServiceImpl';

const botContainer = new Container();
// Database/Repository dependencies
botContainer.bind<ChannelConfigurationRepository>(Types.ChannelConfigurationRepository).to(PrismaChannelConfigurationRepository).inSingletonScope();
botContainer.bind<PrismaClient>(Types.PrismaClient).toConstantValue(prisma);

// Service dependencies
botContainer.bind<ConnectionService>(Types.ConnectionService).to(ConnectionServiceImpl).inSingletonScope();

export { botContainer };