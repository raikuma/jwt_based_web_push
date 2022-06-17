<template>
  <div>
    <input type="text" v-model="user">
    <input type="password" v-model="password">
    <button type="submit" @click="login">Login</button>
  </div>
  <div>
    <p v-if="status === 'fail'" style="color: red">Login Failed</p>
    <p v-if="status === 'success'" style="color: green">Login Successed</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: 'admin',
      password: '1234',
      status: ''
    }
  },
  methods: {
    login () {
      this.axios.post('/auth', {
        user: this.user,
        password: this.password
      })
      .then((res) => {
        console.log(res)
        localStorage.setItem('token', res.data)
        localStorage.setItem('user', this.user)
        this.status = 'success'
        window.location = '/'
      })
      .catch((err) => {
        console.error(err)
        this.status = 'fail'
      })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
