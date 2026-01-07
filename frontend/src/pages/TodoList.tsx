import React, { useState } from 'react';

type TodoItemProps = {
    id: string;
    title: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, newTitle: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({
    id,
    title,
    completed,
    onToggle,
    onDelete,
    onEdit,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(title);

    const handleSave = () => {
        if (value.trim()) {
            onEdit(id, value.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setValue(title);
        setIsEditing(false);
    };

    return (
        <div
            className="
        w-full max-w-full
        p-4 rounded-lg border shadow-sm bg-white
        flex flex-col sm:flex-row sm:items-start sm:justify-between
        gap-3
        box-border
      "
        >
            {/* LEFT: CHECKBOX + TEXT */}
            <div className="flex items-start gap-3 w-full min-w-0">
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => onToggle(id)}
                    className="mt-1 shrink-0"
                />

                {!isEditing ? (
                    <span
                        className={`break-words w-full ${completed ? 'line-through text-gray-400' : ''
                            }`}
                    >
                        {title}
                    </span>
                ) : (
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                    />
                )}
            </div>

            {/* RIGHT: ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {!isEditing ? (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full sm:w-auto text-sm text-blue-500 hover:underline"
                        >
                            Edit
                        </button>

                        <button
                            onClick={() => onDelete(id)}
                            className="w-full sm:w-auto text-sm text-red-500 hover:underline"
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleSave}
                            className="w-full sm:w-auto text-sm text-green-600 hover:underline"
                        >
                            Save
                        </button>

                        <button
                            onClick={handleCancel}
                            className="w-full sm:w-auto text-sm text-gray-500 hover:underline"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;
