import { IsNotEmpty, IsString } from "class-validator";

export class CreateMachineDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
}
