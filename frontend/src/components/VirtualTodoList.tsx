import React, { useState } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import { Todo } from '../types';
import { useTheme } from '../context/ThemeContext';

interface VirtualTodoListProps {
    todos: Todo[];
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, description?: string) => void;
}

type RowData = {
    todos: Todo[];
    onToggle: VirtualTodoListProps['onToggle'];
    onDelete: VirtualTodoListProps['onDelete'];
    onEdit: VirtualTodoListProps['onEdit'];
    theme: 'light' | 'dark';
};

const Row = ({ index, style, data }: ListChildComponentProps<RowData>) => {
    const todo = data.todos[index];
    const { onToggle, onDelete, onEdit, theme } = data;

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDescription, setEditDescription] = useState(todo.description || '');

    const handleSave = () => {
        onEdit(todo.id, editTitle, editDescription);
        setIsEditing(false);
    };

    return (
        <div style={style} className="px-2 py-1">
            <div
                className={`p-4 rounded-lg border flex justify-between items-start gap-3 shadow-sm ${theme === 'dark'
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                    }`}
            >

                <div className="flex items-start gap-3 flex-1">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => onToggle(todo.id, !todo.completed)}
                        className="mt-1 w-5 h-5"
                    />

                    {isEditing ? (
                        <div className="flex-1 space-y-2">
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className={`w-full px-2 py-1 rounded outline-none ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                    }`}
                            />
                            <input
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                className={`w-full px-2 py-1 rounded outline-none text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100'
                                    }`}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="text-xs px-2 py-1 rounded bg-green-500 text-white"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-xs px-2 py-1 rounded bg-gray-500 text-white"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="flex-1 cursor-pointer"
                            onDoubleClick={() => setIsEditing(true)}
                        >
                            <p
                                className={`font-medium ${todo.completed ? 'line-through text-gray-500' : ''
                                    }`}
                            >
                                {todo.title}
                            </p>
                            {todo.description && (
                                <p className="text-sm text-gray-500 truncate">
                                    {todo.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(todo.id)}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

const VirtualTodoList: React.FC<VirtualTodoListProps> = ({
    todos,
    onToggle,
    onDelete,
    onEdit,
}) => {
    const { theme } = useTheme();

    return (
        <div className="h-[600px] w-full">
            <List
                height={600}
                width={800}
                itemCount={todos.length}
                itemSize={90}
                itemData={{ todos, onToggle, onDelete, onEdit, theme }}
            >
                {Row}
            </List>
        </div>
    );
};

export default VirtualTodoList;
