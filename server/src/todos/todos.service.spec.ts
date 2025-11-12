import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Model } from 'mongoose';

describe('TodosService', () => {
  let service: TodosService;
  let model: Model<Todo>;

  const mockTodo = {
    _id: '507f1f77bcf86cd799439011',
    content: 'Test todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTodoModel = {
    new: jest.fn().mockResolvedValue(mockTodo),
    constructor: jest.fn().mockResolvedValue(mockTodo),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getModelToken(Todo.name),
          useValue: mockTodoModel,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    model = module.get<Model<Todo>>(getModelToken(Todo.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodoDto: CreateTodoDto = { content: 'Test todo' };
      const saveMock = jest.fn().mockResolvedValue(mockTodo);
      
      // Mock the model constructor to return an object with a save method
      (model as unknown as { new: jest.Mock }).new = jest.fn().mockReturnValue({
        save: saveMock,
      });

      const result = await service.create(createTodoDto);
      
      expect(result).toEqual(mockTodo);
      expect(saveMock).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [mockTodo];
      const execMock = jest.fn().mockResolvedValue(todos);
      jest.spyOn(model, 'find').mockReturnValue({
        exec: execMock,
      } as never);

      const result = await service.findAll();
      
      expect(result).toEqual(todos);
      expect(model.find).toHaveBeenCalled();
    });

    it('should return empty array when no todos exist', async () => {
      const execMock = jest.fn().mockResolvedValue([]);
      jest.spyOn(model, 'find').mockReturnValue({
        exec: execMock,
      } as never);

      const result = await service.findAll();
      
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const execMock = jest.fn().mockResolvedValue(mockTodo);
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: execMock,
      } as never);

      const result = await service.findOne(mockTodo._id);
      
      expect(result).toEqual(mockTodo);
      expect(model.findById).toHaveBeenCalledWith(mockTodo._id);
    });

    it('should throw NotFoundException when todo not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: execMock,
      } as never);

      await expect(service.findOne('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateDto: UpdateTodoDto = { completed: true };
      const updatedTodo = { ...mockTodo, completed: true };
      const execMock = jest.fn().mockResolvedValue(updatedTodo);
      
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: execMock,
      } as never);

      const result = await service.update(mockTodo._id, updateDto);
      
      expect(result).toEqual(updatedTodo);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockTodo._id,
        updateDto,
        { new: true },
      );
    });

    it('should throw NotFoundException when todo not found', async () => {
      const updateDto: UpdateTodoDto = { completed: true };
      const execMock = jest.fn().mockResolvedValue(null);
      
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: execMock,
      } as never);

      await expect(service.update('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a todo', async () => {
      const execMock = jest.fn().mockResolvedValue(mockTodo);
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: execMock,
      } as never);

      const result = await service.remove(mockTodo._id);
      
      expect(result).toEqual(mockTodo);
      expect(model.findByIdAndDelete).toHaveBeenCalledWith(mockTodo._id);
    });

    it('should throw NotFoundException when todo not found', async () => {
      const execMock = jest.fn().mockResolvedValue(null);
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: execMock,
      } as never);

      await expect(service.remove('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
