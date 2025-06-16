// src/usuarios/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'operador' })
  role: 'admin' | 'operador';

  @CreateDateColumn()
  createdAt: Date;
}

