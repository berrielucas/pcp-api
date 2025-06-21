import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductionOrderDto {
    @IsNumber()
    @IsNotEmpty()
    readonly manager_id: number;

    @IsNumber()
    @IsNotEmpty()
    readonly item_id: number;

    @IsNumber()
    @IsNotEmpty()
    readonly quantity: number;
    
    @IsDate()
    @IsNotEmpty()
    readonly deadline: Date;

    @IsString()
    @IsNotEmpty()
    @IsEnum({
        pending: 'pending',
        in_progress: 'in_progress',
        finished: 'finished',
        cancelled: 'cancelled',
    })
    @IsOptional()
    readonly status?: 'pending' | 'in_progress' | 'finished' | 'cancelled';
}
