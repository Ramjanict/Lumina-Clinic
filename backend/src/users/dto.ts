import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiPropertyOptional({ example: "Sarah Connor", description: "Patient name" })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({ example: "+1 555-0199", description: "Phone number" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ example: "52nd Cross, Richmond", description: "Address line 1" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  address1?: string;

  @ApiPropertyOptional({ example: "Circle, London", description: "Address line 2" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;

  @ApiPropertyOptional({ example: "Female", enum: ["Male", "Female", "Other", "Not selected"], description: "Gender" })
  @IsOptional()
  @IsIn(["Male", "Female", "Other", "Not selected"])
  gender?: string;

  @ApiPropertyOptional({ example: "1994-07-24", description: "Date of birth (YYYY-MM-DD)" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  dob?: string;
}
