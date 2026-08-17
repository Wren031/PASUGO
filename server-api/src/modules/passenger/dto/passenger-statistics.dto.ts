import { IsInt, IsDecimal } from 'class-validator';

export class PassengerStatisticsDto {
  @IsInt()
  totalRides: number;

  @IsInt()
  cancelledRides: number;

  @IsDecimal({ decimal_digits: '3-2' })
  averageRating?: number;
}