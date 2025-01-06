/**
 * Main Gatsby configuration file.
 * This file defines the necessary setup for the Gatsby project, including
 * plugins, site metadata, and other essential configurations.
 *
 * @module gatsby-config
 * @see https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 **/

/**
 * Site metadata configuration.
 * Defines custom metadata for the site, accessible via GraphQL queries.
 * @typedef {Object} SiteMetadata
 * @property {string} title - The title of your site.
 * @property {string} description - A short description of your site.
 * @property {string} author - The author or organization responsible for the site.
 * @property {string} siteUrl - The base URL of your site (useful for SEO).
 */
const siteMetadata = {
  title: "MyReality Project",
  description: "A platform merging simulation, quantum mechanics, and social dynamics.",
  author: "Your Name or Team",
  siteUrl: "https://myreality.example.com", // Change to your site's URL
};

/**
 * Plugin configuration array.
 * This section contains all plugins used in the Gatsby project.
 * Each plugin provides additional functionality or integrations.
 * @typedef {Object[]} PluginConfig
 * @property {string} resolve - The name of the plugin or package.
 * @property {Object} [options] - Optional configuration for the plugin.
 */
const plugins = [
  {
    resolve: "gatsby-source-filesystem",
    options: {
      name: "images",
      path: `${__dirname}/src/images`, // Path to image assets
    },
  },
  {
    resolve: "gatsby-plugin-image",
    options: {
      defaults: {
        quality: 90, // Default image quality
        formats: ["auto", "webp", "avif"], // Automatically optimize images
      },
    },
  },
  {
    resolve: "gatsby-plugin-sharp",
    options: {
      useMozJpeg: true, // Use MozJPEG for better JPEG compression
      stripMetadata: true, // Remove image metadata for smaller file sizes
    },
  },
  {
    resolve: "gatsby-transformer-sharp",
    options: {}, // No specific options needed
  },
  {
    resolve: "gatsby-plugin-react-helmet",
    options: {}, // Enables management of document head (HTML <head>)
  },
  {
    resolve: "gatsby-plugin-manifest",
    options: {
      name: "MyReality",
      short_name: "MyReality",
      start_url: "/",
      background_color: "#ffffff", // Background color for the app
      theme_color: "#000000", // Theme color for address bar in supported browsers
      display: "standalone", // App behavior
      icon: "src/images/favicon.png", // Path to favicon
    },
  },
  {
    resolve: "gatsby-plugin-offline",
    options: {}, // Adds offline PWA support
  },
  {
    resolve: "gatsby-plugin-mdx",
    options: {
      extensions: [".mdx", ".md"], // Enable MDX and Markdown support
    },
  },
  /**
   * Add more plugins here as your project grows.
   * For example:
   *   - gatsby-source-graphql (for GraphQL API connections)
   *   - gatsby-plugin-sitemap (for automated sitemap generation)
   **/
];

/**
 * Main Gatsby configuration export.
 *
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata,
  plugins,
};