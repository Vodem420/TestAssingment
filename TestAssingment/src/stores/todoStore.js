import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', () => {
    const todos = ref([]);
    const allTodos = ref([]);

    async function getTodos(currentUserId) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            const filteredTodos = data.filter(todo => todo.userId == currentUserId);
            todos.value = filteredTodos;
            return filteredTodos;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    };

    async function getAllTodos() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();

            allTodos.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            throw error;
        }
    };

    return { todos, allTodos, getTodos, getAllTodos };
});