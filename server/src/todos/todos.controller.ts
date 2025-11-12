import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    return await this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll() {
    return await this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const todo = await this.todosService.findOne(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    const todo = await this.todosService.update(id, updateTodoDto);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const todo = await this.todosService.remove(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }
}
