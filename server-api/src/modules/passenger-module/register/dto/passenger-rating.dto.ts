import { IsDecimal, IsInt } from 'class-validator';

export class PassengerRatingDto {
  @IsDecimal({ decimal_digits: '3-2' })
  averageRating?: number;
}