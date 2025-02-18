interface CompletionRequest {
    filepath: string;
    content: string;
    cursor: number;
    contextBefore?: string;
    contextAfter?: string;
}

interface PatchRequest {
    filepath: string;
    originalContent: string;
    desiredChange: string;
    contextManager: AIContextManager;
}

interface CodePatch {
    start: number;
    end: number;
    newContent: string;
    confidence: number;
}

class AICompletionService {
    constructor(
        private apiKey: string,
        private baseUrl: string = 'https://api.openai.com/v1'
    ) {}

    async getCompletion(request: CompletionRequest): Promise<string> {
        const prompt = this.buildCompletionPrompt(request);
        
        const response = await fetch(`${this.baseUrl}/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                prompt,
                max_tokens: 150,
                temperature: 0.3,
                stream: true,
            }),
        });

        return this.handleStreamingResponse(response);
    }

    async generatePatch(request: PatchRequest): Promise<CodePatch> {
        const fileContext = request.contextManager.prepareLowLevelContext(request.filepath);
        const prompt = this.buildPatchPrompt(request, fileContext);

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a code modification assistant. Generate precise patches with minimal changes.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.2,
                functions: [{
                    name: 'apply_patch',
                    parameters: {
                        type: 'object',
                        properties: {
                            start: { type: 'number' },
                            end: { type: 'number' },
                            new_content: { type: 'string' },
                            confidence: { type: 'number' }
                        },
                        required: ['start', 'end', 'new_content', 'confidence']
                    }
                }],
                function_call: { name: 'apply_patch' }
            }),
        });

        const result = await response.json();
        const functionArgs = JSON.parse(result.choices[0].message.function_call.arguments);

        return {
            start: functionArgs.start,
            end: functionArgs.end,
            newContent: functionArgs.new_content,
            confidence: functionArgs.confidence
        };
    }

    private buildCompletionPrompt(request: CompletionRequest): string {
        return `
File: ${request.filepath}
Content before cursor:
${request.contextBefore || request.content.substring(0, request.cursor)}

Suggest completion for:
${request.content.substring(request.cursor)}

Context after:
${request.contextAfter || ''}
        `.trim();
    }

    private buildPatchPrompt(request: PatchRequest, fileContext: string): string {
        return `
File Context:
${fileContext}

Original Content:
${request.originalContent}

Desired Change:
${request.desiredChange}

Generate a minimal patch that implements the desired change while maintaining code consistency.
Focus on the specific section that needs to change.
        `.trim();
    }

    private async handleStreamingResponse(response: Response): Promise<string> {
        const reader = response.body?.getReader();
        let completion = '';

        while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    completion += data.choices[0].text;
                }
            }
        }

        return completion;
    }
}

// Integration with existing context manager
interface AIContextManager {
    prepareLowLevelContext(filepath: string): string;
    recordChange(change: any): void;
}

// Example usage:
const completionService = new AICompletionService('your-api-key');

// Get real-time completion
const completion = await completionService.getCompletion({
    filepath: 'src/user/profile.ts',
    content: 'function updateUser(',
    cursor: 19
});

// Generate a patch
const patch = await completionService.generatePatch({
    filepath: 'src/user/profile.ts',
    originalContent: 'function updateUser(id: string) { /* ... */ }',
    desiredChange: 'Add email parameter with validation',
    contextManager: existingContextManager
});

// Apply patch and record change
if (patch.confidence > 0.8) {
    // Apply patch logic here
    existingContextManager.recordChange({
        files: ['src/user/profile.ts'],
        type: 'implementation',
        description: 'Added email parameter to updateUser function',
        relatedDecisions: []
    });
}
