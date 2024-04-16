<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from './../stores/loginStore';

const loginStore = useLoginStore();
loginStore.getUsers();

const router = useRouter();
const name = ref('');
const phone = ref('');
const error = ref(false);

const handleName = (event) => {
  const filteredValue = event.target.value.replace(/[^a-zA-Zа-яА-Я]/g, '');
  name.value = filteredValue;
};

const login = () => {
    console.log(loginStore.users, 'loginStore.users.value');
    const foundUser = loginStore.users.find(user => {
    return (user.username.toLowerCase() === name.value.toLowerCase() && user.phone === phone.value);
  });

  if (foundUser) {
    console.log("User found:", foundUser);
    loginStore.addUserToStore(foundUser);
    router.push('/userPage');
    return true;
  } else {
    console.log("User not found");
    error.value = true;
    return false;
  }
};

</script>


<template>
    <div class="modal">
        <div class="modal__head">description</div>
        <div class="modal__body">
            <div class="modal__title">description</div>
            <input type="text" placeholder="Username" v-model="name" @input="handleName">
            <input type="text" placeholder="Phone Number" v-model="phone">
            <button @click="login">Register</button>
            <p v-show="error" class="modal__error">Login Error</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.modal{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -80%);
    width: 47.7rem;
    min-height: 30rem;
    max-height: 30rem;
    border-radius: .5rem;
    overflow: hidden;
    &__head{
        background: #A5A5A5;
        padding: 1rem;
        color: #5F5F5F;
        text-align: center;
    }
    &__body{
        display: flex;
        flex-direction: column;
        height: 25rem;
        padding: 0 2rem;
        background: #C3C3C3;
        gap: 1.5rem;
    }
    &__title{
        font-size: 1.5rem;
        line-height: 2.1rem;
        font-weight: 400;
        color: #5F5F5F;
        padding: 2rem 0 0;
    }
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
        width: 100%;
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
    &__error{
        color: red;
        font-size: 1.5rem;
        text-align: center;
    }
}
</style>