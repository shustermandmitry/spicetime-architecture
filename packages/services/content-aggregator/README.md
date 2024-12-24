# Content Aggregator Service

**Version:** 1.0.0  
**License:** MIT  

## Overview

The Content Aggregator Service is a GraphQL-based application that aggregates content from GitHub repositories into Markdown files or displays folder structures. 

## Features

1. Aggregate text-based content from GitHub into a single Markdown file.
2. Filter files by glob-style patterns or preset types like `CONFIG`.
3. Fail-safe mechanism to handle non-text files gracefully.
4. Query folder structures of repositories.

## Usage

### Content Aggregation Query

```graphql
query {
  contentAggregator(
    pattern: "*.md",
    repoName: "example-repo",
    owner: "example-owner",
    rootDir: "/docs",
    preset: null
  ) {
    success
    markdownFile
    error
  }
}
```

### Folder Structure Query

```graphql
query {
  folderStructure(
    repoName: "example-repo",
    owner: "example-owner",
    rootDir: "/"
  ) {
    root
    structure {
      fullPath
      type
      name
    }
  }
}
```

---