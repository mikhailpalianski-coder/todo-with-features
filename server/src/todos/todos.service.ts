import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo, TodoDocument } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = await this.todoModel.create(createTodoDto);
    return createdTodo.toObject() as Todo;
  }

  async findAll(): Promise<Todo[]> {
    return (await this.todoModel.find().exec()) as Todo[];
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo as Todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, updateTodoDto, { new: true })
      .exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo as Todo;
  }

  async remove(id: string): Promise<Todo> {
    const todo = await this.todoModel.findByIdAndDelete(id).exec();
    if (!todo) throw new NotFoundException('Todo not found');
    return todo as Todo;
  }
}
