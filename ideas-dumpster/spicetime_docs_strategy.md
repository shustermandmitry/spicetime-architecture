# Spicetime Docs Strategy

## **Overview**

The goal is to streamline and automate the process of handling documentation across a monorepo using a smart, simple, and developer-friendly framework.

The solution involves:
1. A **Vite Plugin (`spicetimeDocs`)** to orchestrate the docs pipeline without requiring complex configurations.
2. A **React-based Docs Package** (`spicetimeDocs` app) to build the actual docs pipeline and route local and global documentation.
3. **Global and Local Routing Integration** to aggregate monorepo packages into a seamless documentation app.
4. **Optional Gatsby Integration** to easily plug the output into a larger static documentation site.
5. **AI-powered interaction** to consult devs only when necessary to confirm changes or resolve ambiguities.

---

## **Key Components**

### **1. The Vite Plugin (`spicetimeDocs`)**
#### **Goals**
- Automatically **crawl the repository** to aggregate `.jsx` files within `docs/` directories across all monorepo packages.
- Execute the **docs pipeline** at the correct stage in the Vite build process.
- Operate as a **zero-config plugin**: it figures out repo structure by analyzing context and avoids requiring tedious developer input.
- Trigger **interactive dev sessions** only when changes occur or ambiguities need decisions.

#### **Implementation Skeleton**
```javascript
import { defineConfig } from "vite";
import path from "path";

export default () => ({
  name: "vite-plugin-spicetime-docs",
  
  configResolved(config) {
    console.log("Vite config resolved:", config.root);
  },

  configureServer(server) {
    // Watch docs directories or run pipeline interactively
    server.watcher.add("**/docs/**/*.jsx");
    console.log("Docs pipeline attached...");
  },

  buildStart() {
    // Crawl monorepo to find .jsx files and aggregate
    const docsFiles = crawlRepoForDocsFiles(/* custom logic */);
    console.log("Found docs files:", docsFiles);
    // Trigger spicetimeDocs pipeline
    executeDocsPipeline(docsFiles);
  },

  generateBundle() {
    // Add final docs routes to the bundle, if needed
    console.log("Finalizing docs...");
  },

  // Additional custom utility hooks
});
```

#### **Features**
- **Crawling Logic**: Traverses repo structure to locate docs in all `docs/**/*.jsx` directories.
- **Pipeline Execution**: Integrates pipeline execution via the `spicetimeDocs` React app.
- **AI-powered Dev Session**: During ambiguities (e.g., unmet assumptions), initiates a session and consults the dev interactively.

---

### **2. The React App (`spicetimeDocs`)**
#### **Goals**
- Act as the **central documentation pipeline**, building and orchestrating:
  - **Local Routing**: For monorepo individual packages' docs (e.g., `/packages/package-name`).
  - **Global Integration**: Aggregates all package documentation under a centralized structure.
  - **Shared Functionality**:
    - Global navigation and state.
    - Theming and layouts.
    - GQL client configuration (Apollo, etc.).

#### **Proposed Structure**
```plaintext
src/
|-- pages/
    |-- index.jsx                    # Main Docs Landing Page
    |-- package-routes/
        |-- PackageDocRouter.jsx     # Local routers from monorepo packages
    |-- global/
        |-- MainDocsRouter.jsx       # Central router for global routes
|-- state/
    |-- GlobalStore.jsx              # State management
|-- gql/
    |-- apolloClient.js              # GraphQL client configuration
|-- nav/
    |-- SidebarNav.jsx               # Shared global navigation bar
```

#### **Routing Example**
This example shows how local (per-package) routers integrate globally:
```jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { PackageDocRouter } from "./pages/package-routes/PackageDocRouter";
import { MainDocsRouter } from "./pages/global/MainDocsRouter";
import { SidebarNav } from "./nav/SidebarNav";

export default function App() {
  return (
    <Router>
      <SidebarNav />
      <Routes>
        <Route path="/docs/*" element={<MainDocsRouter />} />
        <Route path="/packages/*" element={<PackageDocRouter />} />
      </Routes>
    </Router>
  );
}
```

---

### **3. Gatsby Integration**
#### **Role of Gatsby**
- Acts as the **front-end wrapper** for the `spicetimeDocs` output.
- Simplifies deployment as part of a larger static documentation site (handled by Gatsby).

#### **Integration Approach**
- Configure Gatsby to use the `spicetimeDocs` app as its primary documentation renderer.

##### Example: Using the React App Inside Gatsby
`gatsby-browser.js`:
```javascript
import React from "react";
import App from "spicetimeDocs";

export const wrapPageElement = ({ element, props }) => (
  <App {...props}>{element}</App>
);
```

This ensures that the `spicetimeDocs` React app is fully embedded into the Gatsby site.

---

### **4. AI-Powered Interactive Sessions**
#### **Why AI?**
- Developers don’t want to be interrupted—it should only ask for input when necessary!
- Whenever the pipeline encounters **unambiguous changes**, it proceeds silently.
- For complex or unclear structures (e.g., deciding routes), consult the dev interactively.

#### **Examples of Dev Sessions**
An interactive session could:
1. **Analyze Changes**: Check if new files need additional configuration.
2. **Propose Solutions**: Suggest routes/links for new docs.
3. **Ask for Confirmation**: Only if assumptions cannot be validated autonomously.

CLI Example:
```bash
> spicetimeDocs detected new docs in 'package-X'. Suggested route: '/docs/package-x'.
> Would you like to confirm? (y/n)
```

---

## **Benefits**
1. **Eliminates Config Fatigue**:
   - No JSON files or manual router setup—everything works based on repo context.
2. **Scalability**:
   - New monorepo packages are automatically picked up without requiring major changes.
3. **Automation and Smarts**:
   - Tedious and repetitive tasks handled by automation.
   - Developers only intervened when decisions are genuinely needed.
4. **Modularity**:
   - The architecture is flexible enough to adapt to specific needs (e.g., alternate hosting scenarios).

---

## **Final Remarks**
This strategy achieves a **developer-first documentation pipeline** by combining the strengths of Vite, React, and smart automation. The integration of Gatsby ensures flexibility for future deployment, while the AI-driven interaction model keeps the process simple and efficient.

---

Let me know if you'd like me to expand or adjust any specific sections! 😊