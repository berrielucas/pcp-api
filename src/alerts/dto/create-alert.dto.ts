import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateAlertDto {
    @IsObject()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => User)
    readonly user: User;

    @IsString()
    @IsNotEmpty()
    @IsEnum({
        error: 'error',
        general: 'general',
        order_update: 'order_update',
        order_completed: 'order_completed',
        restock: 'restock',
        inventory_low: 'inventory_low',
    })
    @IsOptional()
    readonly alert_type?: 'error' | 'general' | 'order_update' | 'order_completed' | 'restock' | 'inventory_low';

    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    readonly reference_id?: number;

    @IsString()
    @IsNotEmpty()
    readonly message: string;

    @IsBoolean()
    @IsNotEmpty()
    @IsOptional()
    readonly is_read?: boolean;
}
