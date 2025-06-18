src/
├── modules/
│   ├── items/
│   │   ├── dto/
│   │   │   ├── create-item.dto.ts
│   │   │   ├── update-item.dto.ts
│   │   ├── entities/
│   │   │   └── item.entity.ts
│   │   ├── item.controller.ts
│   │   ├── item.service.ts
│   │   ├── item.module.ts
│   │   ├── item.repository.ts
│   ├── inventory/
│   │   ├── dto/
│   │   │   ├── create-inventory.dto.ts
│   │   │   ├── update-inventory.dto.ts
│   │   ├── entities/
│   │   │   └── inventory.entity.ts
│   │   ├── inventory.controller.ts
│   │   ├── inventory.service.ts
│   │   ├── inventory.module.ts
│   │   ├── inventory.repository.ts
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   ├── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   ├── user.repository.ts
│   ├── machines/
│   │   ├── dto/
│   │   │   ├── create-machine.dto.ts
│   │   │   ├── update-machine.dto.ts
│   │   ├── entities/
│   │   │   └── machine.entity.ts
│   │   ├── machine.controller.ts
│   │   ├── machine.service.ts
│   │   ├── machine.module.ts
│   │   ├── machine.repository.ts
│   ├── production-orders/
│   │   ├── dto/
│   │   │   ├── create-production-order.dto.ts
│   │   │   ├── update-production-order.dto.ts
│   │   ├── entities/
│   │   │   └── production-order.entity.ts
│   │   ├── production-order.controller.ts
│   │   ├── production-order.service.ts
│   │   ├── production-order.module.ts
│   │   ├── production-order.repository.ts
│   ├── order-materials/
│   │   ├── dto/
│   │   │   ├── create-order-material.dto.ts
│   │   │   ├── update-order-material.dto.ts
│   │   ├── entities/
│   │   │   └── order-material.entity.ts
│   │   ├── order-material.controller.ts
│   │   ├── order-material.service.ts
│   │   ├── order-material.module.ts
│   │   ├── order-material.repository.ts
│   ├── production-schedule/
│   │   ├── dto/
│   │   │   ├── create-production-schedule.dto.ts
│   │   │   ├── update-production-schedule.dto.ts
│   │   ├── entities/
│   │   │   └── production-schedule.entity.ts
│   │   ├── production-schedule.controller.ts
│   │   ├── production-schedule.service.ts
│   │   ├── production-schedule.module.ts
│   │   ├── production-schedule.repository.ts
│   ├── performance/
│   │   ├── dto/
│   │   │   ├── create-performance.dto.ts
│   │   │   ├── update-performance.dto.ts
│   │   ├── entities/
│   │   │   └── performance.entity.ts
│   │   ├── performance.controller.ts
│   │   ├── performance.service.ts
│   │   ├── performance.module.ts
│   │   ├── performance.repository.ts
│   ├── alerts/
│   │   ├── dto/
│   │   │   ├── create-alert.dto.ts
│   │   │   ├── update-alert.dto.ts
│   │   ├── entities/
│   │   │   └── alert.entity.ts
│   │   ├── alert.controller.ts
│   │   ├── alert.service.ts
│   │   ├── alert.module.ts
│   │   ├── alert.repository.ts
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   └── shared/
│       ├── decorators/
│       │   └── roles.decorator.ts
│       ├── guards/
│       │   └── roles.guard.ts
│       ├── interceptors/
│       │   └── logging.interceptor.ts
│       ├── filters/
│       │   └── http-exception.filter.ts
│       └── utils/
│           └── utils.service.ts
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
├── common/
│   ├── interfaces/
│   │   ├── base.interface.ts
│   │   └── pagination.interface.ts
│   ├── enums/
│   │   └── role.enum.ts
│   ├── constants/
│   │   └── app.constants.ts
└── main.ts
