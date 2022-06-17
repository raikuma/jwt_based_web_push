<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
  <p>{{ user }}</p>
  <button @click="logout">Logout</button>
  <button @click="allowNoti">Allow Notification</button>
  <button @click="registService">Regist Service</button>
  <button @click="subscribe">Subscribe</button>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  components: {
    HelloWorld
  },
  data() {
    return {
      user: '',
      subscription: null
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      window.location = '/login'
    },
    allowNoti() {
      Notification.requestPermission()
        .then((result) => {
          if (result === 'granted') {
            console.log('Allowed Notification')
            this.randomNotification()
          }
        })
    },
    randomNotification() {
      new Notification('Title', { body: 'hello', icon: '/favicon.ico' })
    },
    registService() {
      navigator.serviceWorker
        .register('service-worker.js')
        .then((registration) => {
          return registration.pushManager.getSubscription()
            .then(async (subscription) => {

              if (subscription) {
                return subscription
              }

              function urlBase64ToUint8Array(base64String) {
                var padding = '='.repeat((4 - base64String.length % 4) % 4)
                var base64 = (base64String + padding)
                  .replace(/\-/g, '+')
                  .replace(/_/g, '/')

                var rawData = window.atob(base64)
                var outputArray = new Uint8Array(rawData.length)

                for (var i = 0; i < rawData.length; ++i) {
                  outputArray[i] = rawData.charCodeAt(i)
                }
                return outputArray
              }

              const vapidPublicKey = 'BDy4v6XxOOi-REUmsJjIB6LOQCLpAao7Pvappfa-ov6kdSeDxEWohR0Oogis0wEiGS6enI4PEtZM1tg4KR77yhQ'
              const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

              return registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey
              })

            })
        })
        .then((subscription) => {
          this.subscription = subscription
          fetch('/register', {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              subscription: subscription
            })
          })
        })
    },
    subscribe() {
      fetch('/sendNotification', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          subscription: this.subscription,
          payload: 'notification!',
          delay: 5,
          ttl: 3600
        })
      })
    }
  },
  created() {
    this.user = localStorage.getItem('user')
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
