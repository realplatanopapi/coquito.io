const path = require('path')

const express = require('express')
const helmet = require('helmet')
const nunjucks = require('nunjucks')

module.exports = async function start ({
  posts
}) {
  const postsBySlug = posts.reduce((acc, post) => {
    return {
      ...acc,
      [post.slug]: post
    }
  }, {})

  const app = express()

  const viewsPaths = [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'static/dist')
  ]
  nunjucks.configure(viewsPaths, {
    noCache: process.env.NODE_ENV !== 'production',
    autoescape: true,
    express: app
  })

  const staticPath = path.join(__dirname, 'static/dist')
  app.use(express.static(staticPath))

  app.use(helmet())

  app.get('/', (req, res) => {
    res.render('index.html', {
      posts
    })
  })

  app.get('/:slug', (req, res) => {
    const post = postsBySlug[req.params.slug]
    if (!post) {
      return res.status(404)
    }

    res.render('post.html', {
      post
    })
  })

  return app
}