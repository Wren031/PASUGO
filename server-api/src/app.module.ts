import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth-module/auth.module';
import { PassengerModule } from './modules/passenger-module/register/passenger.module';
import { DriverModule } from './modules/driver-module/register/driver.module';
import { RegistrationCodeModule } from './modules/admin-module/driver-code/code.module';
import { AdminDriverModule } from './modules/admin-module/drivers/driver.module';
import { UserModule } from './modules/admin-module/users/users.module';
import { BranchModule } from './modules/admin-module/grocery-branch/grocery-branch.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'auth',
        ttl: 60_000,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    PassengerModule,
    DriverModule,
    RegistrationCodeModule,
    AdminDriverModule,
    UserModule,
    BranchModule
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}