import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";

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
    
    @IsString()
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

    @ValidateIf(o => o.status === 'finished')
    @IsNumber()
    @IsNotEmpty()
    readonly approved_quantity?: number;
}
