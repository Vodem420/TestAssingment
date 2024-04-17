import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useLoginStore = defineStore('login', () => {
    const users = ref([]);
    const currentUser = ref(null);

    async function getUsers() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            users.value = data;
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    function addUserToStore(foundUser) {
        currentUser.value = foundUser;
    }

    return { users, currentUser, getUsers, addUserToStore };
});