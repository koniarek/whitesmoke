import React from 'react'
import Helmet from 'react-helmet'

import PageHeader from '../components/PageHeader'
import PostSection from '../components/PostSection'
import PostCategoriesNav from '../components/PostCategoriesNav'

// Export Template for use in CMS preview
export const BlogIndexTemplate = ({
  title,
  subtitle,
  featuredImage,
  posts = [],
  postCategories = [],
  contentType
}) => {
  const isCategory = contentType === 'postCategories'
  const byCategory = post =>
    post.categories &&
    post.categories.filter(cat => cat.category === title).length
  const filteredPosts = isCategory ? posts.filter(byCategory) : posts

  return (
    <main className="Blog">
      <Helmet>
        <title>{title}</title>
      </Helmet>

      <PageHeader
        large
        title={title}
        subtitle={subtitle}
        backgroundImage={featuredImage}
      />

      {!!postCategories.length && (
        <PostCategoriesNav categories={postCategories} />
      )}

      {!!posts.length && <PostSection posts={filteredPosts} />}
    </main>
  )
}

// Export Default BlogIndex for front-end
const BlogIndex = ({ data: { page, posts, postCategories } }) => (
  <BlogIndexTemplate
    {...page}
    {...page.fields}
    {...page.frontmatter}
    posts={posts.edges.map(post => ({
      ...post.node,
      ...post.node.frontmatter,
      ...post.node.fields
    }))}
    postCategories={postCategories.edges.map(post => ({
      ...post.node,
      ...post.node.frontmatter,
      ...post.node.fields
    }))}
  />
)

export default BlogIndex

export const pageQuery = graphql`
  ## Query for BlogIndex data
  ## Use GraphiQL interface (http://localhost:8000/___graphql)
  ## $id is processed via gatsby-node.js
  ## query name must be unique to this file
  query BlogIndex($id: String!) {
    page: markdownRemark(id: { eq: $id }) {
      fields {
        contentType
      }
      frontmatter {
        title
        template
        subtitle
        featuredImage {
          ...FluidImage
        }
      }
    }

    posts: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "posts" } } }
      sort: { order: DESC, fields: [frontmatter___date] }
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            categories {
              category
            }
            featuredImage {
              ...SmallImage
            }
          }
        }
      }
    }
    postCategories: allMarkdownRemark(
      filter: { fields: { contentType: { eq: "postCategories" } } }
      sort: { order: ASC, fields: [frontmatter___title] }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
