interface ArchitecturalDecision {
    id: string;
    timestamp: Date;
    description: string;
    rationale: string;
    impactedAreas: string[];
    status: 'active' | 'modified' | 'deprecated';
}

interface CodeChange {
    timestamp: Date;
    files: string[];
    type: 'structure' | 'implementation' | 'refactor';
    description: string;
    relatedDecisions: string[];
}

interface ContextSnapshot {
    timestamp: Date;
    architecturalSummary: string;
    activeDecisions: ArchitecturalDecision[];
    recentChanges: CodeChange[];
    currentFocus: string;
}

class AIContextManager {
    private decisions: Map<string, ArchitecturalDecision> = new Map();
    private changes: CodeChange[] = [];
    private currentContext: ContextSnapshot | null = null;

    constructor() {
        this.initializeContext();
    }

    private initializeContext() {
        this.currentContext = {
            timestamp: new Date(),
            architecturalSummary: '',
            activeDecisions: [],
            recentChanges: [],
            currentFocus: ''
        };
    }

    recordDecision(decision: Omit<ArchitecturalDecision, 'id' | 'status'>) {
        const id = crypto.randomUUID();
        const newDecision = {
            ...decision,
            id,
            status: 'active' as const
        };
        
        this.decisions.set(id, newDecision);
        this.updateContext();
        
        return id;
    }

    recordChange(change: Omit<CodeChange, 'timestamp'>) {
        const newChange = {
            ...change,
            timestamp: new Date()
        };
        
        this.changes.push(newChange);
        this.updateContext();
    }

    private updateContext() {
        const activeDecisions = Array.from(this.decisions.values())
            .filter(d => d.status === 'active');
        
        const recentChanges = this.changes
            .slice(-5) // Keep last 5 changes in context
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        this.currentContext = {
            timestamp: new Date(),
            architecturalSummary: this.generateArchitecturalSummary(),
            activeDecisions,
            recentChanges,
            currentFocus: this.determineCurrentFocus()
        };
    }

    private generateArchitecturalSummary(): string {
        // In a real implementation, this would analyze decisions and changes
        // to generate a meaningful summary
        const activeDecisions = Array.from(this.decisions.values())
            .filter(d => d.status === 'active');
        
        return `Current architecture reflects ${activeDecisions.length} active decisions. ` +
               `Recent focus areas: ${this.getRecentFocusAreas().join(', ')}`;
    }

    private getRecentFocusAreas(): string[] {
        return Array.from(new Set(
            this.changes
                .slice(-10)
                .flatMap(change => change.files)
                .map(file => file.split('/')[0])
        ));
    }

    private determineCurrentFocus(): string {
        const recentChanges = this.changes.slice(-3);
        if (recentChanges.length === 0) return '';

        // Simple heuristic: use most common type of recent changes
        const changeTypes = recentChanges.map(c => c.type);
        const mostCommonType = changeTypes.sort(
            (a, b) => 
                changeTypes.filter(t => t === b).length -
                changeTypes.filter(t => t === a).length
        )[0];

        return `Current focus appears to be ${mostCommonType} work`;
    }

    prepareHighLevelContext(): string {
        if (!this.currentContext) return '';

        return `
Current Architectural Context:
${this.currentContext.architecturalSummary}

Active Decisions:
${this.currentContext.activeDecisions
    .map(d => `- ${d.description} (${d.rationale})`)
    .join('\n')}

Recent Changes:
${this.currentContext.recentChanges
    .map(c => `- ${c.type}: ${c.description}`)
    .join('\n')}

Current Focus: ${this.currentContext.currentFocus}
        `.trim();
    }

    prepareLowLevelContext(filepath: string): string {
        const relevantChanges = this.changes
            .filter(c => c.files.includes(filepath))
            .slice(-3);

        const relevantDecisions = Array.from(this.decisions.values())
            .filter(d => d.impactedAreas.some(area => filepath.includes(area)));

        return `
File Context for ${filepath}:
${relevantDecisions.map(d => `- Decision: ${d.description}`).join('\n')}
${relevantChanges.map(c => `- Change: ${c.description}`).join('\n')}
        `.trim();
    }

    suggestAITool(context: string): 'high-level' | 'low-level' {
        // Simple heuristic: if context mentions architecture or structure,
        // suggest high-level AI, otherwise low-level
        const structuralKeywords = [
            'architecture',
            'structure',
            'design',
            'pattern',
            'refactor'
        ];

        return structuralKeywords.some(keyword => 
            context.toLowerCase().includes(keyword)
        ) ? 'high-level' : 'low-level';
    }
}

// Example usage:
const manager = new AIContextManager();

// Record initial architectural decision
const decisionId = manager.recordDecision({
    timestamp: new Date(),
    description: 'Adopt microservices architecture',
    rationale: 'Better scalability and team autonomy',
    impactedAreas: ['services', 'api']
});

// Record some changes
manager.recordChange({
    files: ['services/user/profile.ts'],
    type: 'structure',
    description: 'Split user service into profile and auth',
    relatedDecisions: [decisionId]
});

// Get context for high-level AI discussion
console.log('High-level context:');
console.log(manager.prepareHighLevelContext());

// Get context for specific file
console.log('\nLow-level context:');
console.log(manager.prepareLowLevelContext('services/user/profile.ts'));

// Get AI tool suggestion
const query = "How should we structure the user authentication flow?";
console.log('\nSuggested AI tool:', manager.suggestAITool(query));
