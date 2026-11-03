import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { SPECIALITIES } from "../common/constants";

export class CreateDoctorDto {
  @ApiProperty({ example: "Dr. Richard James", description: "Doctor full name" })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: "richard.james@lumina.com", description: "Doctor email address" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "doctorpass123", minLength: 8, description: "Doctor password (min 8 chars)" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: "General physician", enum: SPECIALITIES, description: "Doctor medical speciality" })
  @IsIn(SPECIALITIES)
  speciality!: string;

  @ApiProperty({ example: "MBBS, MD", description: "Medical degrees and certifications" })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  degree!: string;

  @ApiProperty({ example: "4 Years", description: "Years of professional experience" })
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  experience!: string;

  @ApiProperty({ example: "Dr. Richard has a strong commitment to delivering comprehensive medical care.", description: "Doctor biography" })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  about!: string;

  @ApiProperty({ example: 50, minimum: 1, maximum: 100000, description: "Consultation fees in USD" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  fees!: number;

  @ApiProperty({ example: "17th Cross, Richmond", description: "Clinic primary address" })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  address1!: string;

  @ApiPropertyOptional({ example: "Circle, Ring Road, London", description: "Clinic secondary address" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;
}

export class UpdateDoctorDto {
  @ApiPropertyOptional({ example: true, description: "Availability for appointments" })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    return value === true || value === "true";
  })
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ example: 60, description: "Consultation fees in USD" })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === "" ? undefined : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100000)
  fees?: number;

  @ApiPropertyOptional({ example: "Updated bio description...", description: "Doctor biography" })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  about?: string;

  @ApiPropertyOptional({ example: "17th Cross, Richmond", description: "Clinic address line 1" })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  address1?: string;

  @ApiPropertyOptional({ example: "Circle, London", description: "Clinic address line 2" })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;
}
