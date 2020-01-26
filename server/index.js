const express = require('express');
const next = require('next');
const routes = require('../routes');

const authServices = require('./services/auth')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = routes.getRequestHandler(app);

const secreatData = [
    {
        title: 'secreate Data1',
        description: 'plans how to build xxx'
    },
    {
        title: 'secreate Data2',
        description: 'i am super man ' 
    }
]

app.prepare()
.then(() => {
  const server = express();

  server.get('/api/v1/secreat', authServices.checkJWT, (req, res) => {
    res.json(secreatData)
  })

  server.get('/api/v1/onlysiteowner', authServices.checkJWT, authServices.checkRole('siteOwner'), (req, res) => {
    console.log(req.user)
    res.json(secreatData)
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  server.use(function(err, req, res, next){
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({title: 'Unauthorized', detail: 'token denied!!'})
    }
  })

  server.use(handle).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })

})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})
