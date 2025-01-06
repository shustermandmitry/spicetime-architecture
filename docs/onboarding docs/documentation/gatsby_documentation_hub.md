# **Using Gatsby as the Documentation Hub**

## **What is Gatsby?**

Gatsby is a powerful static site generator that simplifies building scalable and fast websites. As the central hub for your documentation, it will aggregate and present content from your project files (Markdown, Typedoc, architecture diagrams, etc.).

In the context of your project, Gatsby integrates content from:
1. **Local Markdown files** for manually written docs (e.g., `docs/` directory).
2. **Typedoc-generated documentation**, rendered as an `iframe` from a local webserver.
3. **Custom components**, like architecture diagrams from **C4Builder**, interactive visualizations, etc.

---

## **Gatsby Project Configuration**

The main configuration file, `gatsby-config.js`, defines the plugins and settings necessary to build your documentation.

### **Configuration File: `gatsby-config.js`**

#### **Key Sections**
1. **Gatsby Theme for Documentation**
   - Plugin: `gatsby-theme-documentation`.
   - Loads the base path `/` and uses the `docs/` directory to source the content.

2. **Source Filesystem**
   - Plugin: `gatsby-source-filesystem`.
   - Maps the content of your local `docs/` directory for processing by Gatsby.

3. **MDX Rendering**
   - Plugin: `gatsby-plugin-mdx`.
   - Enables writing rich markdown with JavaScript (MDX).
   - Integrates `gatsby-remark-mermaid` for rendering architecture diagrams.

---

## **Custom Components for Documentation**

### 1. **DOCSApp Parent Component**

The **DOCSApp** component will act as the root container for your entire documentation site. It will:
- Wrap Typedoc-generated documentation and other child components.
- Dynamically include Typedoc via an `iframe`, pointing to a local webserver.

#### **Example Implementation**

```javascript
import React from 'react';

// DOCSApp: Parent root component for the Documentation Hub
const DOCSApp = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <header>
        <h1>Documentation Hub</h1>
      </header>

      {/* Typedoc Subsite (Loaded via iframe while avoiding cross-domain issues) */}
      <section style={{ border: '1px solid #ccc', margin: '10px 0' }}>
        <iframe
          src="http://localhost:5000" // Your static server for Typedoc
          title="Typedoc Docs"
          style={{
            width: '100%',
            height: '600px',
            border: 'none',
          }}
        ></iframe>
      </section>

      {/* Other Child Components Dynamically Rendered */}
      <main>{children}</main>
    </div>
  );
};

export default DOCSApp;
```

---

### 2. **High-Order Component (HOC) Utility**

A utility **HOC** can inject properties into your components to integrate with the monorepo structure and provide a unified profile. This HOC enables passing important metadata or props to documentation components.

#### **Example Implementation: `withDocsProfile.js`**

```javascript
import React from 'react';

// HOC to inject documentation profile as props
const withDocsProfile = (WrappedComponent) => {
  return (props) => {
    const docsProfile = {
      // Metadata for monorepo structures
      monorepoRoot: '/path/to/root',
      repoName: 'my-repo',
      docVersion: '1.0.0',
    };

    return <WrappedComponent {...props} docsProfile={docsProfile} />;
  };
};

export default withDocsProfile;
```

#### **Usage in a Component**
Wrapping any component to pass in `docsProfile`:
```javascript
import React from 'react';
import withDocsProfile from './withDocsProfile';

const DocsComponent = ({ docsProfile }) => {
  return (
    <div>
      <h1>Documentation for {docsProfile.repoName}</h1>
      <p>Version: {docsProfile.docVersion}</p>
    </div>
  );
};

export default withDocsProfile(DocsComponent);
```

---

### 3. **Monorepo Integration**

Gatsby should be integrated into the monorepo as a part of the **documentation package**. By using metadata (via the `profile` prop or JSON configurations), Gatsby can adapt dynamically to serve information about the repository structure.

#### **Key Features**
1. Use the HOC utility to fetch repository-level metadata dynamically.
2. Centralize architecture diagrams, API documentation, and decision records into a unified interface.

---

### 4. **Typedoc Integration**

Typedoc generates static documentation for your TypeScript code. Instead of merging it into Gatsby directly, use an **`iframe`** approach:
1. Start a static server for Typedoc output.
2. Use an `iframe` in the **DOCSApp** component to integrate the documentation under the same domain.

#### **Steps**
1. **Generate Typedoc Documentation**:
   ```sh
   pnpm run docs.typedoc:build
   ```

2. **Serve Typedoc as a Static File**:
   Use any static server to serve the output (e.g., `http-server`):
   ```sh
   npx http-server ./path/to/typedoc/output -p 5000
   ```

3. **Include in Gatsby via `iframe`**:
   Add an `iframe` in the **DOCSApp** component pointing to `http://localhost:5000`.

---

## **Directory Structure**
Here’s how your documentation directory might look: