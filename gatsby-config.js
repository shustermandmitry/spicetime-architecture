module.exports = {
  plugins: [
    {
      resolve: 'gatsby-theme-documentation',
      options: {
        basePath: '/',
        contentPath: 'docs'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'docs',
        path: `${__dirname}/docs`
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          'gatsby-remark-mermaid'
        ]
      }
    }
  ]
}