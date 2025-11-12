import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  const mockTodo = {
    _id: '507f1f77bcf86cd799439011',
    content: 'Test todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: mockTodosService,
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = { content: 'New todo' };
      mockTodosService.create.mockResolvedValue(mockTodo);

      const result = await controller.create(createTodoDto);

      expect(result).toEqual(mockTodo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockTodosService.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [mockTodo];
      mockTodosService.findAll.mockResolvedValue(todos);

      const result = await controller.findAll();

      expect(result).toEqual(todos);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockTodosService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      mockTodosService.findOne.mockResolvedValue(mockTodo);

      const result = await controller.findOne(mockTodo._id);

      expect(result).toEqual(mockTodo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockTodosService.findOne).toHaveBeenCalledWith(mockTodo._id);
    });

    it('should throw NotFoundException when todo not found', async () => {
      mockTodosService.findOne.mockRejectedValue(
        new NotFoundException('Todo not found'),
      );

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateDto: UpdateTodoDto = { completed: true };
      const updatedTodo = { ...mockTodo, completed: true };
      mockTodosService.update.mockResolvedValue(updatedTodo);

      const result = await controller.update(mockTodo._id, updateDto);

      expect(result).toEqual(updatedTodo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockTodosService.update).toHaveBeenCalledWith(mockTodo._id, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      mockTodosService.remove.mockResolvedValue(mockTodo);

      const result = await controller.remove(mockTodo._id);

      expect(result).toEqual(mockTodo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockTodosService.remove).toHaveBeenCalledWith(mockTodo._id);
    });
  });
});
