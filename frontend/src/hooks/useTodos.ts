import { useState, useCallback, useEffect } from 'react';
import { todoService } from '../services/todoService';
import { Todo, CreateTodoDto } from '../types';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);


    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        try {
            let completed;
            if (filter === 'active') completed = false;
            if (filter === 'completed') completed = true;

            const response = await todoService.getTodos(page, 10, search, completed, sort);
            setTodos(response.data);
            setTotal(response.pagination.total);
            setError(null);
        } catch (err) {
            setError('Failed to fetch todos');
        } finally {
            setLoading(false);
        }
    }, [page, search, filter, sort]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTodos();
        }, 300);
        return () => clearTimeout(timeout);
    }, [fetchTodos]);

    const addTodo = async (data: CreateTodoDto) => {
        try {
            const newTodo = await todoService.createTodo(data);
            setTodos(prev => [newTodo, ...prev]);
            setTotal(prev => prev + 1);
        } catch (err) {
            setError('Failed to create todo');
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t));

        try {
            await todoService.updateTodo(id, { completed });
        } catch (err) {
            setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
            setError('Failed to update todo');
        }
    };

    const updateTodoText = async (id: string, title: string, description?: string) => {
        try {
            const updated = await todoService.updateTodo(id, { title, description });
            setTodos(prev => prev.map(t => t.id === id ? updated : t));
        } catch (err) {
            setError('Failed to update todo');
        }
    };

    const removeTodo = async (id: string) => {

        const oldTodos = [...todos];
        setTodos(prev => prev.filter(t => t.id !== id));

        try {
            await todoService.deleteTodo(id);
            setTotal(prev => prev - 1);
        } catch (err) {
            setTodos(oldTodos);
            setError('Failed to delete todo');
        }
    };

    return {
        todos,
        loading,
        error,
        total,
        page,
        setPage,
        search,
        setSearch,
        filter,
        setFilter,
        sort,
        setSort,
        addTodo,
        toggleTodo,
        updateTodoText,
        removeTodo,
        refresh: fetchTodos
    };
};
