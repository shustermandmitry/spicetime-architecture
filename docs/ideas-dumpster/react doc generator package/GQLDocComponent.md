# GQLDoc Component

## **Overview**

The `GQLDoc` component is a React-based utility designed to dynamically generate documentation from a GraphQL schema, query module, or raw SDL (Schema Definition Language). It creates a properly rendered and styled HTML structure that can seamlessly embed into documentation pages.

This component is the first building block in a broader, **AI-driven, fully modular documentation generator**, forming the foundation of automating and streamlining chaotic development workflows.

---

## **Features**

- **Dynamic Schema Parsing**:
  - Parses a GraphQL schema (`GraphQLSchema` object) or SDL definitions (raw strings).
  - Renders details of Queries, Mutations, and Custom Types (fields, args, and descriptions).

- **Embedded HTML Styling**:
  - Generates clean, styled HTML structures ready to embed into an app or documentation page.
  
- **Customizable Themes**:
  - Supports both `light` and `dark` themes for its output.

- **Extendable**:
  - Handles schema links, nested types, Markdown descriptions, and more as it evolves.

This is the **first step** toward a larger goal of creating a modular, reusable doc generator that integrates smoothly into existing tools like **Typedoc**, **Gatsby**, **Mermaid**, and others.

---

## **Getting Started**

### **Installation**

This component will live in the `doc-generator` folder within the `content-aggregator` package for now but is designed to be extracted into its own library later as the documentation suite grows.

1. Add the `doc-generator` folder to the current project:
   ```bash
   mkdir doc-generator && cd doc-generator
   ```

2. Move the existing introspection script into this folder for reuse alongside `GQLDoc`.

3. Install necessary dependencies:
   ```bash
   npm install graphql
   ```

---

### **Usage**

#### **Creating and Using the `GQLDoc` Component**

1. **Component Initial Setup**
   First, create the `GQLDoc` React component.

   ```tsx
   import React from "react";
   import { GraphQLSchema, GraphQLObjectType, GraphQLNamedType } from "graphql";

   interface GQLDocProps {
     schema: GraphQLSchema;
     theme?: "light" | "dark";
   }

   export const GQLDoc: React.FC<GQLDocProps> = ({ schema, theme = "light" }) => {
     const queryType: GraphQLObjectType | undefined = schema.getQueryType();
     const mutationType: GraphQLObjectType | undefined = schema.getMutationType();

     return (
       <div className={`gql-doc gql-doc-${theme}`}>
         <h1>GraphQL Documentation</h1>
         {queryType && (
           <section>
             <h2>Queries</h2>
             {Object.values(queryType.getFields()).map((field) => (
               <div key={field.name}>
                 <strong>{field.name}</strong> - {field.description || "No description"}
                 <pre>{JSON.stringify(field.args, null, 2)}</pre>
               </div>
             ))}
           </section>
         )}
         {mutationType && (
           <section>
             <h2>Mutations</h2>
             {Object.values(mutationType.getFields()).map((field) => (
               <div key={field.name}>
                 <strong>{field.name}</strong> - {field.description || "No description"}
               </div>
             ))}
           </section>
         )}
       </div>
     );
   };
   ```

2. **Embedding the Component**
   Embed the component in your React app or documentation page:

   ```jsx
   import React from "react";
   import { GQLDoc } from "./doc-generator/GQLDoc";
   import { buildSchema } from "graphql";

   const schema = buildSchema(`
     type Query {
       hello: String
     }
   `);

   const App = () => (
     <div>
       <GQLDoc schema={schema} theme="dark" />
     </div>
   );

   export default App;
   ```

3. **Styling**
   Style your component with basic themes:

   ```css
   .gql-doc {
       font-family: Arial, sans-serif;
       line-height: 1.6;
       padding: 16px;
   }
   .gql-doc-light {
       background: #ffffff;
       color: #000000;
   }
   .gql-doc-dark {
       background: #2d2d2d;
       color: #ffffff;
   }
   ```

---

### **Planned Enhancements**

The `GQLDoc` component is designed to scale. Here's what's coming next:

1. **Schema Relationship Linking**:
   - Automatically link nested types back to their definitions (e.g., `User -> Post -> Comment`).

2. **Markdown Descriptions**:
   - Render field and type descriptions as Markdown.

3. **Query Module Integration**:
   - Parse and render GraphQL query modules (e.g., `.graphql` or `gql` imports).

4. **Advanced Routing**:
   - Ship the types, queries, and schema relationships to a larger documentation router:
     - Handles foster destinations like **Typedoc**, **Mermaid**, or **Gatsby**.

5. **Multi-Source Schema Integration**:
   - Combine schemas or query modules from multiple sources into one comprehensive doc structure.

---

## **Project Vision**

This first component is part of a larger goal to create a **self-organizing, AI-powered documentation generator** that simplifies and automates today's chaotic development workflows. Here's what we're building in the big picture:

1. **React Components**:
   - `GQLDoc` to start, followed by additional generators for REST APIs, file structures, and workflows.
   
2. **Foster Router**:
   - Routes all documentation to their proper destinations (Typedoc, Gatsby, Mermaid, custom frameworks, etc.).
   - Automatically identifies targets during build or runtime ("ship 'em and ask questions later").

3. **Organic System**:
   - Continuously adapts and grows with the project, automating doc generation in an **AI-first, configuration-free** way.

You're not just writing docs; you're creating **functional order out of chaos**, one meaningful, reusable piece at a time.

Let’s get started! 🚀