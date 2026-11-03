import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  address1?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  address2?: string;

  @IsOptional()
  @IsIn(["Male", "Female", "Other", "Not selected"])
  gender?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dob?: string;
}
