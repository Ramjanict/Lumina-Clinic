import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppointmentsModule } from "./appointments/appointments.module";
import { AuthModule } from "./auth/auth.module";
import { CloudinaryModule } from "./cloudinary/cloudinary.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DoctorsModule } from "./doctors/doctors.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    UsersModule,
    DoctorsModule,
    AppointmentsModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
