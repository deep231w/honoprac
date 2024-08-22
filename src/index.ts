import { Hono } from 'hono'

const app = new Hono()

app.post('/api/v1/signup', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/login', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
  return c.text('Hello Hono!')
})


export default app
