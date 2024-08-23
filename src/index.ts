import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt'

 const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

// Create the main Hono app
// const app = new Hono<{
// 	Bindings: {
// 		DATABASE_URL: string,
// 		JWT_SECRET: string,
// 	}
// }>();

app.post('/api/v1/signup', async(c) => {
    const prisma =new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json()
    try {
          const user = await prisma.user.create( { 
           data:{
              email: body.email,
              password: body.password,
            }}
        )
        console.log('JWT_SECRET:', c.env.JWT_SECRET);

        const token = await sign({id:user.id}, c.env.JWT_SECRET);
        console.log(token);
        return c.json({ token })
           
    }catch (e) {
      console.error("error:", e);
      return c.json({message: 'Error creating'})
    }
})



app.post('/api/v1/signin', async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
      const user = await prisma.user.findUnique({
        where: { 
          email: body.email
         }
      })
      if (!user) {
        return c.json({ message: 'User not found' })
      }
      console.log('JWT_SECRET', c.env.JWT_SECRET)
      const token = await sign({id: user.id}, c.env.JWT_SECRET);
      return c.json({ token })
  }catch (e) {
    console.error(e)
    return c.json({ message: 'Error logging in' })
  }
})

app.get('/api/v1/blog/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
  return c.text('Hello Hono!')
})


export default app
