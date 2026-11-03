import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Sarah Connor", description: "Full name of the patient" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "sarah@example.com", description: "Email address" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "password123", minLength: 8, description: "Account password (min 8 characters)" })
  @IsString()
  @MinLength(8)
  password!: string;
}

export class LoginDto {
  @ApiProperty({ example: "admin@gmail.com", description: "User, Doctor, or Admin email" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "admin@12345", description: "Account password" })
  @IsString()
  @MinLength(1)
  password!: string;
}
