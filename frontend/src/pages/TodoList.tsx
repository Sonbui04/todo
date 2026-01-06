import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTodos } from '../hooks/useTodos';
import VirtualTodoList from '../components/VirtualTodoList';

const TodoList: React.FC = () => {
    const { logout, user } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const {
        todos,
        loading,
        error,
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
    } = useTodos();

    const [newTodo, setNewTodo] = React.useState('');
    const [newDescription, setNewDescription] = React.useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        addTodo({ title: newTodo, description: newDescription });
        setNewTodo('');
        setNewDescription('');
    };

    return (
        <div
            className={`min-h-screen flex justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                } py-10 px-4`}
        >
            <div
                className={`w-full max-w-4xl rounded-xl shadow-lg flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}
                style={{ height: '90vh' }} // ⭐ QUAN TRỌNG: cố định chiều cao card
            >
                {/* HEADER */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white shrink-0">
                    <h1 className="text-2xl font-bold">Todo List</h1>
                    <div className="flex items-center gap-4">
                        <span>{user?.name || user?.email}</span>
                        <button onClick={toggleTheme} className="p-2 rounded hover:bg-blue-700">
                            {theme === 'dark' ? '🌞' : '🌙'}
                        </button>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* ADD + FILTER (KHÔNG SCROLL) */}
                <div className="p-6 space-y-4 shrink-0">
                    <form onSubmit={handleAdd} className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Add a new task..."
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-200'
                                    }`}
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)..."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-white border-gray-200'
                                    }`}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Add
                        </button>
                    </form>

                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex gap-2">
                            {(['all', 'active', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${filter === f
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as any)}
                                className="px-4 py-2 border rounded-lg text-sm"
                            >
                                <option value="newest">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* LIST (CHỈ PHẦN NÀY SCROLL) */}
                <div className="flex-1 px-6 pb-6 overflow-hidden">
                    {loading && todos.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">Loading todos...</div>
                    ) : error ? (
                        <div className="text-center py-10 text-red-500">{error}</div>
                    ) : (
                        <VirtualTodoList
                            todos={todos}
                            onToggle={toggleTodo}
                            onDelete={removeTodo}
                            onEdit={updateTodoText}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoList;
