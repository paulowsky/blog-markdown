const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const contentName = getNode(node.parent).sourceInstanceName
    createNodeField({
      name: 'collection',
      node,
      value: contentName
    })
    createNodeField({
      name: 'slug',
      node,
      value: createFilePath({ node, getNode })
    })
  }
}

exports.createPages = async({ graphql, actions }) => {
  const { createPage } = actions

  const query = await graphql(`
    query {
      posts: allMarkdownRemark(filter: { fields: { collection: { eq: "pages" } } }) {
        edges {
          node {
            frontmatter {
              path
              title
              description
            }
          }
        }
      }
      authors: allMarkdownRemark(filter: { fields: { collection: { eq: "authors" } } }) {
        edges {
          node {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  const templatePost = path.resolve('src/templates/post.js')
  query.data.posts.edges.forEach(post => {
    createPage({
      path: post.node.frontmatter.path,
      component: templatePost,
      context: {
        id: post.node.frontmatter.path
      }
    })
  })

  const templateAuthor = path.resolve('src/templates/author.js')
  query.data.authors.edges.forEach(author => {
    createPage({
      path: author.node.fields.slug,
      component: templateAuthor,
      context: {
        id: author.node.frontmatter.title
      }
    })
  })

  const templateBlog = path.resolve('src/templates/blog.js')
  const pageSize = 2
  const totalPosts = query.data.posts.edges.length
  const numPages = Math.ceil(totalPosts/pageSize)

  Array
    .from({ length: numPages })
    .forEach((_, i) => {
      createPage({
        path: '/blog' + (i === 0 ? '' : '/'+i),
        component: templateBlog,
        context: {
          limit: pageSize,
          skip: i * pageSize,
          numPages,
          currentPage: i
        }
      })
    })
}
