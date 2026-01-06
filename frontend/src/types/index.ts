export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface User {
    id: number;
    email: string;
    name?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface TodoResponse {
    data: Todo[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateTodoDto {
    title: string;
    description?: string;
}

export interface UpdateTodoDto {
    title?: string;
    description?: string;
    completed?: boolean;
}
