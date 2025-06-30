import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from 'src/auth/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('User não encontrado');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password, role } = createUserDto;

      let partialCreateUser = {
        name,
        email,
        role,
      };

      if (password) {
        const passwordHash = await this.hashingService.hash(password);
        partialCreateUser = {
          ...{
            password: passwordHash,
            firsh_login: false,
          },
          ...partialCreateUser,
        };
      }

      const user = this.userRepository.create(partialCreateUser);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException("Email já cadastrado no sistema");
      }
      throw error;
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepository.find({
      where: {
        id,
      },
      relations: ['alerts', 'schedule', 'manager_in'],
    });
    if (user?.length) return user[0];
    this.throwNotFoundError();
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['alerts', 'schedule', 'manager_in'],
    });
    if (user) return user;
    this.throwNotFoundError();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, email, name, role } = updateUserDto;

    let partialUpdateUser = {
      name,
      email,
      role,
    };

    if (password) {
      const passwordHash = await this.hashingService.hash(password);
      partialUpdateUser = {
        ...{
          password: passwordHash,
          firsh_login: false,
        },
        ...partialUpdateUser,
      };
    }

    const user = await this.userRepository.preload({
      id,
      ...partialUpdateUser,
    });

    if (user) {
      await this.userRepository.save(user);
      return this.findOne(id);
    }

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
