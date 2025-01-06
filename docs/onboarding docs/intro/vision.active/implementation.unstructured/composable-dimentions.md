# **Multi-Dimensional Documentation Hub**

## **Vision**

This system builds on the idea of cascaded dimensions, composed in fractal patterns, to organize and present workflows and structures spatially. Unlike flat JSON-based profiles, JSX components and cascading "sheets" traverse the documentation repository's nodes (`parent`, `children`) and domains.

### **Key Principles**

1. **JSX-String-Based Profiling**:
   Components define organizational structures and workflows as JSX-based "profiles". These profiles represent the relationships, flows, and metadata of the repository.

2. **Cascading Props Architecture**:
   Profiles include cascading cascading layers (like cascading CSS, but higher-dimensional). Props can flow naturally to spatial nodes (`parent`, `children`) and distributed containers.

3. **Structural-Dimensional Composition**:
   This flexible system enables multi-dimensional constructs to represent domain-specific workflows and structures.

4. **Domain-Tailored Dimensions**:
   Dimensions vary based on domain needs (e.g., documentation, architecture, workflows) with the eventual aim to create an abstract classification and compositional system.

---

## **Getting Started**

The documentation hub builds upon **Gatsby**, acting as a container for these cascading profiles at three levels:
1. **DocsApp Root**: Central hub containing the entire spatial system and cascading structure.
2. **Nodes and Containers**: Organizational nodes cascading profiles down dimensions.
3. **Typedoc, Diagrams, and Workflows**: Components inheriting and contributing to the repository structure.

---

## **Core Component: `DocsAppRoot`**

The `DocsAppRoot` component acts as the central container for cascading dimensional profiles and orchestrates flows.

### **Component Implementation**

```javascript
import React from "react";
import { CascadingContext } from "./context/CascadingContext"; // Context for cascading dimensions
import { ProfileContainer } from "./ProfileContainer";

// Root of Documentation Hub
const DocsAppRoot = ({ profile, children }) => {
  // Centralized cascading logic here
  return (
    <CascadingContext.Provider value={profile}>
      <ProfileContainer profile={profile}>
        <main>{children}</main>
      </ProfileContainer>
    </CascadingContext.Provider>
  );
};

export default DocsAppRoot;
```

### **Attributes of Profile**

The `profile` prop itself is structured as a JSX tree:

```javascript
const profile = (
  <Profile>
    <Dimension name="documentation">
      <Node name="docs">
        <Workflows>
          <Workflow name="linting" />
          <Workflow name="testing" />
        </Workflows>
      </Node>
      <Node name="architecture">
        <Container>
          <Dimension name="diagrams">
            <Workflow name="generation" />
          </Dimension>
        </Container>
      </Node>
    </Dimension>
  </Profile>
);
```

---

## **Core Utility: Cascading System**

Cascading dimensions need a context-aware utility to propagate profiles through nodes.

### **Cascading Context**

```javascript
import React, { createContext, useContext } from "react";

const CascadingContext = createContext(null);

export const useCascadingProfile = () => useContext(CascadingContext);

export { CascadingContext };
```

### **`ProfileContainer` Implementation**

The `ProfileContainer` breaks monotony by leveraging cascading dimensions and rendering optimized views:

```javascript
import React from "react";
import { useCascadingProfile } from "./context/CascadingContext";

export const ProfileContainer = ({ profile, children }) => {
  const activeProfile = useCascadingProfile();

  // Inherit parent profiles while layering new changes
  const mergedProfile = {
    ...activeProfile,
    ...profile,
  };

  return (
    <div className="profile-container" data-profile={JSON.stringify(mergedProfile)}>
      {children}
    </div>
  );
};
```

---

## **Dimensions for Documentation Domains**

This cascading system suits domain-specific workflows, and dimensions themselves adapt to domain contexts.

### Example Dimensions for Documentation

1. **Documentation Domain**
   - Profile: `docs`
   - Workflows: Linting, spelling checks, and link validation (Markdown focus).

2. **Typedoc Domain**
   - Profile: `api`
   - Presentation via iframe (external subdomains are integrated directly into "spaces").

3. **Architecture Domain**
   - Profile: `architecture`
   - Workflow: Visualizations (e.g., generated via `gatsby-remark-mermaid`).

---

## **Integrating with Gatsby**

Gatsby JSX pages are inherently compatible with this pattern, cascading fragments spatially.

### **Page Example: `src/pages/docs.jsx`**

```javascript
import React from "react";
import DocsAppRoot from "../components/DocsAppRoot";
import TypedocIntegration from "../components/TypedocIntegration";

// Profile tree for docs
const docsProfile = (
  <Profile>
    <Dimension name="documentation">
      <Node name="overview">
        <Workflow name="content-sourcing" />
      </Node>
      <Node name="integration">
        <Workflow name="external-docs" />
      </Node>
    </Dimension>
  </Profile>
);

const DocsPage = () => (
  <DocsAppRoot profile={docsProfile}>
    <TypedocIntegration />
  </DocsAppRoot>
);

export default DocsPage;
```

### **Integrating Typedoc via Frame**

```javascript
import React from "react";

const TypedocIntegration = () => (
  <section>
    <h2>API Reference</h2>
    <iframe
      src="http://localhost:5000"
      title="Typedoc Documentation"
      style={{
        width: "100%",
        height: "600px",
        border: "none",
      }}
    />
  </section>
);

export default TypedocIntegration;
```

---

## **Directory Structure**