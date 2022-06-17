const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const jwt = require('jsonwebtoken')
const webPush = require('web-push')

webPush.setVapidDetails(
  'http://localhost:3000/',
  'BDy4v6XxOOi-REUmsJjIB6LOQCLpAao7Pvappfa-ov6kdSeDxEWohR0Oogis0wEiGS6enI4PEtZM1tg4KR77yhQ',
  'JoWVvehRW0B6NuR2UygfDJ8RYBGFSGj4-F-mnNjf8Mk'
)

function isAuthenticated(req, res, next) {
  if (typeof req.headers.authorization !== "undefined") {
    let token = req.headers.authorization.split(" ")[1]
    jwt.verify(token, "MySuperSecretPassPhrase", { algorithm: "HS256" }, (err, user) => {
      if (err) {
        res.redirect('/login')
        // res.status(500).json({ error: "Not Authorized" })
        // throw new Error("Not Authorized")
      }
      return next()
    })
  } else {
    res.redirect('/login')
    // res.status(500).json({ error: "Not Authorized" })
    // throw new Error("Not Authorized")
  }
}

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/web-client/dist/index.html')
})

app.post('/auth', (req, res) => {
  console.log(req.body)
  const { user, password } = req.body
  if (user === 'admin' && password === '1234') {
    const token = jwt.sign({ "user": "admin" }, "MySuperSecretPassPhrase", { algorithm: 'HS256' })
    res.send(token)
  } else {
    res.sendStatus(401)
  }
})

app.post('/register', (req, res) => {
  res.sendStatus(201)
})

app.post('/sendNotification', (req, res) => {
  const subscription = req.body.subscription
  const payload = req.body.payload
  const options = {
    TTL: req.body.ttl
  }

  setTimeout(function() {
    webPush.sendNotification(subscription, payload, options)
    .then(function() {
      res.sendStatus(201)
    })
    .catch(function(error) {
      console.log(error)
      res.sendStatus(500)
    })
  }, req.body.delay * 1000)
})

app.use(express.static('./web-client/dist'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})