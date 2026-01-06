import client from '../api/client';
import { Todo, CreateTodoDto, UpdateTodoDto, TodoResponse } from '../types';

const getTodos = async (page = 1, limit = 10, search = '', completed?: boolean, sort: 'newest' | 'oldest' = 'newest') => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (completed !== undefined) params.append('completed', completed.toString());
    params.append('sort', sort);

    const response = await client.get<TodoResponse>(`/todos?${params.toString()}`);
    return response.data;
};

const createTodo = async (data: CreateTodoDto) => {
    const response = await client.post<Todo>('/todos', data);
    return response.data;
};

const updateTodo = async (id: string, data: UpdateTodoDto) => {
    const response = await client.put<Todo>(`/todos/${id}`, data);
    return response.data;
};

const deleteTodo = async (id: string) => {
    await client.delete(`/todos/${id}`);
};

export const todoService = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
};
