<script setup>
import { ref, computed } from 'vue';
import { useLoginStore } from './../stores/loginStore';
import { useTodoStore } from './../stores/todoStore';

const loginStore = useLoginStore();
loginStore.getUsers();
const todoStore = useTodoStore();
todoStore.getTodos(loginStore.currentUser.id);
todoStore.getAllTodos();

const allUsers = ref(loginStore.users);

const filter = ref('all');
const filterByUsers = ref('');
const searchItem = ref('');

const filteredBySearch = computed(() => {
    const searchItemLower = searchItem.value.trim().toLowerCase();
    return todoStore.todos.filter(todo => todo.title.toLowerCase().includes(searchItemLower));
});

const filteredByFilter = computed(() => {
    let filtered = todoStore.todos;

    if (filter.value === 'completed') {
        filtered = filtered.filter(todo => todo.completed);
    } else if (filter.value === 'uncompleted') {
        filtered = filtered.filter(todo => !todo.completed);
    } else if (filter.value === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        filtered = filtered.filter(todo => favorites.includes(todo.id));
    }

    return filtered;
});

const filteredTodos = computed(() => {
    let todosToFilter = [];

    if (filterByUsers.value === 'all') {
        todosToFilter = todoStore.allTodos;
    } else if (filterByUsers.value === '') {
        todosToFilter = todoStore.todos.filter(todo => todo.userId === loginStore.currentUser.id);
    } else {
        todosToFilter = todoStore.todos.filter(todo => todo.userId === filterByUsers.value);
    }

    if (searchItem.value.trim() !== '') {
        todosToFilter = todosToFilter.filter(todo => todo.title.toLowerCase().includes(searchItem.value.trim().toLowerCase()));
    }

    if (filter.value === 'completed') {
        return todosToFilter.filter(todo => todo.completed);
    } else if (filter.value === 'uncompleted') {
        return todosToFilter.filter(todo => !todo.completed);
    } else if (filter.value === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        return todosToFilter.filter(todo => favorites.includes(todo.id));
    }

    return todosToFilter;
});

const addToFavorites = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
};

const isFavorite = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  return favorites.includes(id);
};

</script>

<template>
 <div>
    <div class="userInfo">
        <pre> id: {{ loginStore.currentUser.id }}</pre>
        <pre> name: {{ loginStore.currentUser.name }}</pre>
        <pre> username: {{ loginStore.currentUser.username }}</pre>
        <pre> phone: {{ loginStore.currentUser.phone }}</pre>
    </div>
    <div class="searchTodo">
        <h1>Search</h1>
        <input type="text" v-model="searchItem" placeholder="search...">
    </div>
    <div class="todoList__wrapper">
        <h1>TODOS</h1>
        <div class="todoList__head">
            <input type="text" placeholder="addTODO">
            <button>ADD</button>
        </div>
        <div class="todoList__filters">
            <select v-model="filter">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
                <option value="favorites">Favorites</option>
            </select>
            <select v-model="filterByUsers">
                <option value="">Default</option>
                <option value="all">Get all todos</option>
                <option v-for="user in allUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
        </div>
    </div>
    <div v-if="filteredTodos.length" class="todoList">
        <div v-for="item in filteredTodos" :key="item.id" class="todoList__item">
            <span>userId: {{ item.userId }} id: {{ item.id }}</span>
            <h3>{{ item.title }}</h3>
            <p>Completed: {{ item.completed }}</p>
            <button @click="addToFavorites(item.id)" :disabled="isFavorite(item.id)">Add to favorites</button>
        </div>
    </div>
    <p v-else class="todoList__placeholder">No todos found.</p>
 </div>
 </template>

<style scoped lang="scss">
.userInfo{
    display: flex;
    flex-direction: column;
    width: fit-content;
    margin: 2rem;
    padding: 2rem;
    border: 1px solid #000;
    border-radius: 1rem;
}
pre{
    color: #FFF;
    font-size: 1.6rem;
}
.searchTodo{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 10rem;
    h1{
        font-size: 2rem;
        color: #FFF;
    }
    input{
        width: 40rem;
        height: 4rem;
        padding: 1rem;
        border-radius: .5rem;
        background: #FFFFFF;
        color: #353535;
        font-size: 1.7rem;
        line-height: 2.1rem;
        font-weight: 400;
        border: none;
        outline: none;
    }
}
.todoList{
    max-width: 80%;
    margin: 5rem auto 0;
    padding-bottom: 20rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    &__wrapper{
        h1{
            text-align: center;
            color: #FFF;
        }
    }
    &__head{
        display: flex;
        align-items: center;
        justify-content: center;
        max-width: 40rem;
        margin: 0 auto;
        column-gap: 2rem;
        input{
            width: 100%;
            height: 4rem;
            padding: 1rem;
            border-radius: .5rem;
            background: #FFFFFF;
            color: #353535;
            font-size: 1.7rem;
            line-height: 2.1rem;
            font-weight: 400;
            border: none;
            outline: none;
        }
        button{
            height: 4rem;
            padding: 1rem 3rem;
            border-radius: .5rem;
            background: #519945;
            color: #FFFFFF;
            font-size: 1.7rem;
            line-height: 2.1rem;
            font-weight: 600;
            border: none;
            outline: none;
            cursor: pointer;
        }
    }
    &__filters{
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-top: 3rem;
        select{
            width: 20rem;
            padding: 1rem;
            border: none;
            border-radius: 2rem;
            outline: none;
        }
    }
    &__item{
        padding: 2rem;
        border: 1px solid #000;
        border-radius: 1rem;
        color: #FFF;
        font-size: 1.6rem;
        button{
            height: 4rem;
            padding: 0 3rem;
            border-radius: .5rem;
            background: #519945;
            color: #FFFFFF;
            font-size: 1.5rem;
            line-height: 2.1rem;
            font-weight: 600;
            border: none;
            outline: none;
            cursor: pointer;
            [disabled]{
                background: red;
                opacity: 0.6;
            }
        }
        button[disabled] {
            opacity: 0.6;
            cursor: not-allowed;
        }
    }
    &__placeholder{
        text-align: center;
        padding-top: 5rem;
        font-size: 2rem;
        color: white;
    }
}
</style>
