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

const filteredTodos = computed(() => {
    let filtered = [];

    if (filterByUsers.value === 'all') {
        filtered = todoStore.allTodos;
    } else if(filterByUsers.value === ''){
        filtered = todoStore.todos.filter(todo => todo.userId === loginStore.currentUser.id);
    } else {
        filtered = todoStore.allTodos.filter(todo => todo.userId === parseInt(filterByUsers.value));
    }

    if (searchItem.value.trim() !== '') {
        filtered = filtered.filter(todo => todo.title.toLowerCase().includes(searchItem.value.trim().toLowerCase()));
    }

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

const addTodo = () => {
    // Получаем значения из полей ввода
    const userId = document.querySelector('.todoList__head input[placeholder="UserID"]').value;
    const title = document.querySelector('.todoList__head input[placeholder="Title"]').value;

    // Проверяем, что оба поля заполнены
    if (userId.trim() !== '' && title.trim() !== '') {
      // Создаем новый туду
      const newTodo = {
        userId: parseInt(userId), // Преобразуем userId в число
        id: Math.floor(Math.random() * 1000) + 1,
        title: title,
        completed: false // Предполагаем, что новый туду не завершен
      };

      // Добавляем новый туду в массив todos в объекте todoStore
      todoStore.todos.push(newTodo);

      // Обновляем отфильтрованный массив filteredTodos
      updateFilteredTodos();
    } else {
      // Выводим сообщение об ошибке, если не все поля заполнены
      alert('Please fill in both UserID and Title fields.');
    }
  };

  const updateFilteredTodos = () => {
    // Обновляем отфильтрованный массив на основе текущих фильтров и поискового запроса
    filteredTodos.value = filteredTodos.value.filter(todo => {
      let matchFilter = true;

      // Применяем фильтр по статусу завершенности
      if (filter.value === 'completed') {
        matchFilter = todo.completed;
      } else if (filter.value === 'uncompleted') {
        matchFilter = !todo.completed;
      } else if (filter.value === 'favorites') {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        matchFilter = favorites.includes(todo.id);
      }

      // Применяем фильтр по пользователю
      if (filterByUsers.value === 'all') {
        // Ничего не меняем
      } else if (filterByUsers.value === '') {
        matchFilter = matchFilter && todo.userId === loginStore.currentUser.id;
      } else {
        matchFilter = matchFilter && todo.userId === parseInt(filterByUsers.value);
      }

      // Применяем фильтр по поисковому запросу
      if (searchItem.value.trim() !== '') {
        matchFilter = matchFilter && todo.title.toLowerCase().includes(searchItem.value.trim().toLowerCase());
      }

      return matchFilter;
    });
  };

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
            <input type="text" placeholder="UserID">
            <input type="text" placeholder="Title">
            <button @click="addTodo">ADD</button>
        </div>
        <div class="todoList__filters">
            <select v-model="filter">
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
                <option value="favorites">Favorites</option>
            </select>
            <select v-model="filterByUsers">
                <option value="" selected>CurrentUser</option>
                <option value="all">Get all todos</option>
                <option v-for="user in allUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
            </select>
        </div>
    </div>
    <div v-if="filteredTodos.length" class="todoList">
        <div v-for="item in filteredTodos" :key="item.id" class="todoList__item">
            <span v-if="item.userId || item.id">userId: {{ item.userId }} id: {{ item.id }}</span>
            <h3 v-if="item.title">{{ item.title }}</h3>
            <p v-if="item.completed">Completed: {{ item.completed }}</p>
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
