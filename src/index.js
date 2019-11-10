const startApp = require('./app')
const loadPosts = require('./load-posts')

module.exports = async function start() {
  const posts = await loadPosts()
  return await startApp({
    posts
  })
}