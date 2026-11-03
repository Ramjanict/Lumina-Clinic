import { IsString, Matches } from "class-validator";

export class BookAppointmentDto {
  @IsString()
  doctorId!: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  slotDate!: string;

  @Matches(/^\d{2}:\d{2}$/)
  slotTime!: string;
}
