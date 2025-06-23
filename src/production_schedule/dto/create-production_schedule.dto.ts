import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductionScheduleDto {
    @IsNumber()
    @IsNotEmpty()
    order_id: number;

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
    status: 'pending' | 'started' | 'completed';
}
