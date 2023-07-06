<script setup>

const email = ref('');
const password = ref('');

const sendLogin = async (e) => {
    e.preventDefault();
    const { data: loginRes } = await useFetch('/api/login', {
        method: 'POST',
        body: {
            email: email,
            password: password
        },
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if(!loginRes.status) {
        console.log(loginRes);
        return;
    }

}

</script>

<template>
    <div class="authform">
        <h1>Kirjaudu sisään</h1>
        <form id="loginform">
            <input v-model="email" type="email" name="email" placeholder="Email"/>
            <input v-model="password" type="password" name="password" placeholder="Password"/>
            <Button @click="sendLogin">Login</Button>
        </form>
    </div>
</template>


<style>

.authform {
  width: 30%;
  height: 50%;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  align-self: center;
  margin: auto 0;
  background-color: var(--black-color)
}
.authform h1 {
    text-align: center;
    text-transform: uppercase;
    color: white;
}
.authform form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.authform form input {
    width: calc(90% - 6px);
    margin-top: 10px;
    padding: 0 0 0 5px;
}
.authform form button {
    margin: 10px 0;
    width: 90%;
}

</style>