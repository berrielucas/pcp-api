import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from "class-validator";

export class CreateProductionScheduleDto {
    @IsNumber()
    @IsNotEmpty()
    machine_id: number;

    @IsNumber()
    @IsNotEmpty()
    operator_id: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum({
        pending: 'pending',
        started: 'started',
        completed: 'completed',
    })
    @IsOptional()
    status?: 'pending' | 'started' | 'completed';

    @IsDateString()
    // @IsOptional()
    start_time: Date;

    @IsDateString()
    // @IsOptional()
    end_time: Date;
}
