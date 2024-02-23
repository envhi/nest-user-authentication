import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'name', 'email'],
    });
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        // select: ['id', 'name', 'email', 'createdAt'],
      });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findOneByEmail(email: string) {
    try {
      return await this.userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async create(data: CreateUserDto) {
    return await this.userRepository.save(this.userRepository.create(data));
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail({ where: { id } });

    this.userRepository.merge(user, data);

    return await this.userRepository.save(user);
  }

  async deleteById(id: number) {
    await this.userRepository.findOneOrFail({ where: { id } });

    await this.userRepository.softDelete(id);
  }
}
