# claude-dev-workflow.artifact.004.md

## Development Phases

### 1. Project Initialization
```
Initial Setup:
1. /branch-project [project-name]
2. Review generated structure
3. Update init.chat.001/info.md with project context
4. Create initial artifacts in init chat

Context Loading:
1. Share relevant artifacts from other projects
2. Link external resources
3. Update project roadmap
```

### 2. Development Cycle

#### Planning Phase
```
1. Create new task chat:
   [task-name].chat.[seq]/

2. Set up context:
   - Update info.md with task goals
   - Reference related artifacts
   - Link required resources

3. Create initial artifacts:
   - Design documents
   - Technical specifications
   - Implementation plans
```

#### Implementation Phase
```
1. Create implementation artifacts:
   - Code snippets
   - Configuration files
   - Documentation updates

2. Regular updates:
   - Update chat roadmap
   - /update-roadmap to propagate changes
   - Share completed artifacts if needed
```

#### Review Phase
```
1. Create review chat if needed:
   review.chat.[seq]/

2. Document decisions:
   - Update chat info.md
   - Create review artifacts
   - Update project roadmap
```

### 3. Context Management

#### During Development
```
Best Practices:
1. One task per chat
2. Clear artifact naming
3. Regular roadmap updates
4. Explicit dependencies
```

#### Between Projects
```
Context Transfer:
1. Share artifacts using full path:
   .artifact.[seq].from.project.[seq].from.chat.[seq].md

2. Document in both:
   - Source chat info.md
   - Target project info.md
```

### 4. Common Workflows

#### Starting New Feature
```
1. Create feature chat
2. Load context via artifact sharing
3. Create design artifacts
4. Update roadmaps
5. Begin implementation
```

#### Code Review
```
1. Create review chat
2. Share implementation artifacts
3. Create review notes artifact
4. Update project roadmap
```

#### Project Sync
```
1. Review chat roadmaps
2. Update project roadmap
3. Share relevant artifacts
4. Update main claude/roadmap.md
```

## Tips for Effective Usage

### Context Loading
- Share minimum necessary artifacts
- Use explicit references in info.md
- Keep resource links up to date

### Chat Management
- Focus on single task/topic
- Clear naming and sequencing
- Regular context updates

### Artifact Sharing
- Share complete artifacts
- Maintain clear dependency chains
- Document sharing in both locations

### Project Organization
- Regular roadmap updates
- Clear chat purposes
- Explicit dependencies
- Clean timeline progression

## Loading Project Instructions

### Initial Load
```
1. Start new chat
2. Load core files:
   - claude-assistant-instructions.artifact.[seq].md
   - claude-dev-workflow.artifact.[seq].md

3. Load project context:
   - Project info.md
   - Project roadmap.md
   - Relevant chat info files
```

### Context Transfer Commands
```
Example: Loading project files
/load-context project spicetime-assistant
/load-files
- spicetime-assistant.project.roadmap.md
- claude-assistant-instructions.artifact.001.md
- claude-dev-workflow.artifact.001.md
```

### Best Practices for Loading
1. Load instruction artifacts first
2. Then load project-specific context
3. Reference specific file versions
4. Verify loaded context before proceeding

### Maintaining Context
- Reload when switching major tasks
- Update instruction versions as needed
- Keep project roadmap current
- Load only relevant artifacts