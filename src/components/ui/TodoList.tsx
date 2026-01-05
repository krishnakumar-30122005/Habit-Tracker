
import React, { useState } from 'react';
import { useTodos } from '../../context/TodoContext';
import { Plus, Check, Trash2, Circle } from 'lucide-react';
import './TodoList.css';

export const TodoList: React.FC = () => {
    const { todos, addTodo, toggleTodo, deleteTodo } = useTodos();
    const [newTodo, setNewTodo] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        addTodo(newTodo);
        setNewTodo('');
    };

    return (
        <div className="todo-container">
            <form onSubmit={handleSubmit} className="todo-input-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="todo-input"
                />
                <button type="submit" className="todo-add-btn">
                    <Plus size={20} />
                </button>
            </form>

            <div className="todo-list">
                {todos.map(todo => (
                    <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <button
                            className="todo-check-btn"
                            onClick={() => toggleTodo(todo._id, !todo.completed)}
                        >
                            {todo.completed ? <Check size={16} /> : <Circle size={16} />}
                        </button>
                        <span className="todo-text">{todo.title}</span>
                        <button
                            className="todo-delete-btn"
                            onClick={() => deleteTodo(todo._id)}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}

                {todos.length === 0 && (
                    <div className="empty-todo-state">
                        <p>No tasks yet. Enjoy your day!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
