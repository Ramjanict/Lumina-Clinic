import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class BookAppointmentDto {
  @ApiProperty({ example: "cly1234567890abcdef", description: "Doctor CUID identifier" })
  @IsString()
  doctorId!: string;

  @ApiProperty({ example: "2026-11-05", description: "Date of appointment in YYYY-MM-DD format (within next 7 days)" })
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  slotDate!: string;

  @ApiProperty({ example: "11:30", description: "Time of appointment in HH:MM format (10:30 - 20:30, 30-min intervals)" })
  @Matches(/^\d{2}:\d{2}$/)
  slotTime!: string;
}
