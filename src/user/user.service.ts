import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException("User não encontrado")
  }

  async create(createUserDto: CreateUserDto) {
    const autor = this.userRepository.create(createUserDto);
    return this.userRepository.save(autor);
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (user) return user;
    this.throwNotFoundError();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto
    });
    if (user) return this.userRepository.save(user);
    this.throwNotFoundError();
  }

  async remove(id: number) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (user) return this.userRepository.remove(user);
    this.throwNotFoundError();
  }
}
