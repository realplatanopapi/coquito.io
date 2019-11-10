const path = require('path')
const fs = require('fs')
const {promisify} = require('util')

const frontMatter = require('front-matter')
const globby = require('globby')
const marked = require('marked')

const readFile = promisify(fs.readFile)

const contentPath = path.join(
  process.cwd(), 'content'
)

const createPostSlug = (postPath) => {
  const {name} = path.parse(postPath)

  return name.toLowerCase()
}

module.exports = async function loadPosts () {
  const paths = await globby(
    path.join(contentPath, '**/*.md')
  )
  return await Promise.all(paths.map(async postPath => {
    const content = await readFile(postPath, 'utf-8')
    const {attributes, body} = frontMatter(content)
    return {
      content: marked(body),
      meta: attributes,
      slug: createPostSlug(postPath)
    }
  }))
}