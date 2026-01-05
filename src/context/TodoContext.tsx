
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface Todo {
    _id: string;
    title: string;
    completed: boolean;
    date?: string;
}

interface TodoContextType {
    todos: Todo[];
    addTodo: (title: string, date?: string) => void;
    toggleTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isAuthenticated } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [isAuthenticated, token]);

    const fetchTodos = async () => {
        try {
            const res = await fetch('/api/todos', {
                headers: { 'x-auth-token': token! }
            });
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            console.error(err);
        }
    };

    const addTodo = async (title: string, date?: string) => {
        try {
            const res = await fetch('/api/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify({ title, date })
            });
            const newTodo = await res.json();
            setTodos(prev => [newTodo, ...prev]);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTodo = async (id: string, completed: boolean) => {
        // Optimistic update
        setTodos(prev => prev.map(t => t._id === id ? { ...t, completed } : t));

        try {
            await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token!
                },
                body: JSON.stringify({ completed })
            });
        } catch (err) {
            console.error(err);
            fetchTodos(); // Revert on error
        }
    };

    const deleteTodo = async (id: string) => {
        setTodos(prev => prev.filter(t => t._id !== id));
        try {
            await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token! }
            });
        } catch (err) {
            console.error(err);
            fetchTodos();
        }
    };

    return (
        <TodoContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (context === undefined) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};
