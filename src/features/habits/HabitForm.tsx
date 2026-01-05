
import React, { useState, useEffect } from 'react';
import { useHabits } from '../../context/HabitContext';
import type { HabitCategory, HabitTimeOfDay, Habit } from '../../types';
import './HabitForm.css';

interface HabitFormProps {
    onClose: () => void;
    habitToEdit?: Habit;
}

export const HabitForm: React.FC<HabitFormProps> = ({ onClose, habitToEdit }) => {
    const { addHabit, updateHabit } = useHabits();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'health' as HabitCategory,
        timeOfDay: 'anytime' as HabitTimeOfDay,
        targetCount: 1,
        frequency: 'daily' as 'daily' | 'weekly'
    });

    useEffect(() => {
        if (habitToEdit) {
            setFormData({
                title: habitToEdit.title,
                description: habitToEdit.description || '',
                category: habitToEdit.category,
                timeOfDay: habitToEdit.timeOfDay,
                targetCount: habitToEdit.targetCount,
                frequency: habitToEdit.frequency
            });
        }
    }, [habitToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) return;

        if (habitToEdit) {
            updateHabit(habitToEdit.id, {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                timeOfDay: formData.timeOfDay,
                targetCount: formData.targetCount,
                frequency: formData.frequency
            });
        } else {
            addHabit({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                timeOfDay: formData.timeOfDay,
                targetCount: formData.targetCount,
                frequency: formData.frequency
            });
        }
        onClose();
    };

    return (
        <form className="habit-form" onSubmit={handleSubmit}>
            <div className="form-head">
                <h2>{habitToEdit ? 'Edit Habit' : 'New Habit'}</h2>
            </div>

            <div className="form-group">
                <label>Habit Title</label>
                <input
                    type="text"
                    placeholder="e.g., Drink 2L Water"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    autoFocus
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Category</label>
                    <select
                        value={formData.category}
                        onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as HabitCategory }))}
                    >
                        <option value="health">Health</option>
                        <option value="learning">Learning</option>
                        <option value="productivity">Productivity</option>
                        <option value="mindset">Mindset</option>
                        <option value="lifestyle">Lifestyle</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Time of Day</label>
                    <select
                        value={formData.timeOfDay}
                        onChange={e => setFormData(prev => ({ ...prev, timeOfDay: e.target.value as HabitTimeOfDay }))}
                    >
                        <option value="anytime">Anytime</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                    </select>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-submit">{habitToEdit ? 'Save Changes' : 'Create Habit'}</button>
            </div>
        </form>
    );
};
