# Vector-Based File System Naming Convention

## Scope Structure

### Local Scoping Rules
- Behaves like JavaScript function scope
- Each folder/file has its own scope
- Vectors act like props passed between scopes
- Siblings can be projects, chats, context files
- Metadata links through vector tags in names

### Double Indexing
```
[folder/file].1.2,5,8_context  # Local tic 1, vectors 2,5,8
```
- First index: Local tic number (update sequence)
- Second index: Array of vector references
- Both indices are optional

### Vector Numbers
- Must be unique within their local scope
- Declared by providing name with number
- Used as reference tags, not positions
- When viewed from parent scope, aligned by names not numbers
- Function as metadata/hashtags for searching/linking

### Example Structure
```
myproject/                      # Parent scope
  vector_1.focus_auth.md       # Local vector definition
  vector_2.focus_ui.md         # Local vector definition
  1.1,2_added_login/           # Folder with tic 1, refs vectors 1,2
    chat.2.1_context.md        # Chat with local tic 2, refs parent's vector 1
    vector_1.focus_flow.md     # New local vector definition
    2.1_updated_flow/          # Subfolder with local tic 2, refs local vector 1
```

## Basic Structure
```
[domain].[type].[tic].[dims]_[context-tags].version
```

## Components

### Domain
- Workspace identifier (e.g., `web`, `claude`, `pkg`)
- Defines primary area of work
- Sets context for interpretation

### Type
- Content type identifier (`project`, `conversation`, `component`)
- Defines expected structure
- Guides tooling behavior

### Tic
- Temporal version marker
- Integer representing evolution step
- Can include sub-versions (e.g., `1.2`)

### Dimensions
- Vector references to fundamental aspects
- Comma-separated indices (e.g., `[1,3,5]`)
- Reference separate dimension definition files
- Zero when dimension not relevant

### Context Tags
- Additional metadata
- Underscore-separated
- Brief descriptive terms
- Support searching/filtering

## Vector Files

### Structure
```
vector_N.dimension_[property-description].md
```
- Define fundamental dimensions
- Provide metrics for measurement
- Enable cross-domain correlation
- Each vector has its own definition file

### Temporal Evolution
```
[project].1.1_added_auth-flow,updated_ui.2
[project].1.2_removed_legacy-code,fixed_routing.3
```
- First index always represents tic (update sequence)
- Each tic annotated with structural changes
- Change annotations use `added_`, `removed_`, `updated_`, `fixed_` prefixes
- Multiple changes separated by commas
- Changes track vector evolution in its scope

## Examples
```
claude.project.1.2_auth,ui_login-flow.1
web.component.2.1,4_responsive,mobile.3
vector_1.dimension_user-interaction.md
```

## Implementation Note
- Composite vectors allowed during development
- Will split naturally as concepts mature
- Used for AI context preservation
- Internal detail, not visible in tooling