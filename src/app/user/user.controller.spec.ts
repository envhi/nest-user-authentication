import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const userEntityList: UserEntity[] = [
  new UserEntity({ id: '1', name: 'name1', email: 'name1@gmail.com' }),
  new UserEntity({ id: '2', name: 'name2', email: 'name2@gmail.com' }),
  new UserEntity({ id: '3', name: 'name3', email: 'name3@gmail.com' }),
];

const newUserEntity = new UserEntity({
  name: 'aa testname',
  email: 'aatestname@gmail.com',
});

const updatedUserEntity = new UserEntity({
  name: 'updated-name1',
  email: 'name1@gmail.com',
});

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(userEntityList),
            create: jest.fn().mockResolvedValue(newUserEntity),
            findOne: jest.fn().mockResolvedValue(userEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedUserEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('index', () => {
    it('should return a user list entity successfully', async () => {
      // Act
      const result = await userController.index();

      // Assert
      expect(result).toEqual(userEntityList);
      // expect(typeof result).toEqual('object');
      // expect(result[0].id).toEqual(userEntityList[0].id);
      expect(userService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userService, 'findAll').mockRejectedValueOnce(new Error());

      // Assert
      expect(userController.index()).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const body: CreateUserDto = {
        name: 'aa testname',
        email: 'aatestname@gmail.com',
      };
      const result = await userController.create(body);

      // Assert
      expect(result).toEqual(newUserEntity);
      expect(userService.create).toHaveBeenCalledTimes(1);
      expect(userService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userService, 'create').mockRejectedValueOnce(new Error());

      // Assert
      const body: CreateUserDto = {
        name: 'aa testname',
        email: 'aatestname@gmail.com',
      };

      expect(userController.create(body)).rejects.toThrow();
    });
  });

  describe('show', () => {
    it('should get a user successfully', async () => {
      // Act

      const result = await userController.show('1');

      expect(result).toEqual(userEntityList[0]);
      expect(userService.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userService, 'findOne').mockRejectedValueOnce(new Error());

      expect(userController.show('1')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update an user successfully', async () => {
      // Arrange
      const body: UpdateUserDto = {
        name: 'updated-name1',
        email: 'name1@gmail.com',
      };

      // Act
      const result = await userController.update('1', body);

      // Assert
      expect(result).toEqual(updatedUserEntity);
      expect(userService.update).toHaveBeenCalledTimes(1);
      expect(userService.update).toHaveBeenCalledWith('1', body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: UpdateUserDto = {
        name: 'updated-name1',
        email: 'name1@gmail.com',
      };

      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());

      // Assert
      expect(userController.update('1', body)).rejects.toThrow();
    });
  });

  describe('destroy', () => {
    it('should remove an user successfully', async () => {
      // Act
      const result = await userController.destroy('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userService, 'deleteById').mockRejectedValueOnce(new Error());

      // Assert
      expect(userController.destroy('1')).rejects.toThrow();
    });
  });
});
