import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('Alerta não encontrado');
  }

  async create(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async findAll(userId: number) {
    return this.alertRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const alert = await this.alertRepository.findOne({
      where: { id },
    });
    if (!alert) {
      this.throwNotFoundError();
    }
    return alert;
  }

  async update(id: number, updateAlertDto: UpdateAlertDto) {
    const alert = await this.alertRepository.preload({
      id,
      ...updateAlertDto,
    });
    if (alert) return this.alertRepository.save(alert);
    this.throwNotFoundError();
  }

  async remove(id: number) {
    const alert = await this.findOne(id);
    if (alert) return this.alertRepository.remove(alert);
    this.throwNotFoundError();
  }

  async markAsRead(id: number) {
    const alert = await this.findOne(id);
    if (alert) {
      if (alert.is_read) {
        return alert;
      }
      alert.is_read = true;
      return this.alertRepository.save(alert);
    }
  }

  async markAllAsRead(userId: number) {
    return this.alertRepository.update(
      { user: { id: userId }, is_read: false },
      { is_read: true },
    );
  }
}
