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
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(SPECIALITIES)
  speciality!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  degree!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  experience!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  about!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100000)
  fees!: number;

  @IsString()
  @MinLength(3)
  @MaxLength(120)
  address1!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;
}

export class UpdateDoctorDto {
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === "") return undefined;
    return value === true || value === "true";
  })
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === null || value === "" ? undefined : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100000)
  fees?: number;

  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  about?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  address1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;
}
