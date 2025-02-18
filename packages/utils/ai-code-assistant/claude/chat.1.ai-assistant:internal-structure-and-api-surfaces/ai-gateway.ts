interface AIModelConfig {
    id: string;
    provider: string;
    type: 'completion' | 'chat' | 'embedding';
    endpoint: string;
    apiKey?: string;
    priority: number;
    capabilities: string[];
    contextWindow: number;
    maxTokens: number;
    isLocal: boolean;
}

interface AIRequest {
    type: 'completion' | 'chat' | 'embedding';
    content: string;
    maxTokens?: number;
    temperature?: number;
    requiredCapabilities?: string[];
    preferredProvider?: string;
}

interface AIResponse {
    content: string;
    provider: string;
    model: string;
    tokensUsed?: number;
    cost?: number;
}

class AIGateway {
    private models: Map<string, AIModelConfig> = new Map();
    private fallbackChains: Map<string, string[]> = new Map();

    constructor() {
        this.initializeFallbacks();
    }

    registerModel(config: AIModelConfig) {
        this.models.set(config.id, config);
        this.updateFallbackChains();
    }

    private initializeFallbacks() {
        this.fallbackChains.set('completion', []);
        this.fallbackChains.set('chat', []);
        this.fallbackChains.set('embedding', []);
    }

    private updateFallbackChains() {
        // Reset fallback chains
        this.initializeFallbacks();

        // Group models by type and sort by priority
        const modelsByType = Array.from(this.models.values()).reduce((acc, model) => {
            if (!acc[model.type]) acc[model.type] = [];
            acc[model.type].push(model);
            return acc;
        }, {} as Record<string, AIModelConfig[]>);

        // Create prioritized fallback chains
        for (const [type, models] of Object.entries(modelsByType)) {
            this.fallbackChains.set(
                type,
                models
                    .sort((a, b) => b.priority - a.priority)
                    .map(m => m.id)
            );
        }
    }

    async process(request: AIRequest): Promise<AIResponse> {
        const eligibleModels = this.findEligibleModels(request);
        
        if (eligibleModels.length === 0) {
            throw new Error('No eligible AI models found for request');
        }

        // Try models in order until one succeeds
        for (const model of eligibleModels) {
            try {
                const response = await this.callModel(model, request);
                return response;
            } catch (error) {
                console.warn(`Model ${model.id} failed:`, error);
                continue;
            }
        }

        throw new Error('All eligible models failed to process request');
    }

    private findEligibleModels(request: AIRequest): AIModelConfig[] {
        const allModels = Array.from(this.models.values());
        
        return allModels
            .filter(model => {
                // Check basic type match
                if (model.type !== request.type) return false;

                // Check capabilities
                if (request.requiredCapabilities) {
                    if (!request.requiredCapabilities.every(cap => 
                        model.capabilities.includes(cap)
                    )) return false;
                }

                // Check token limits
                if (request.maxTokens && 
                    request.maxTokens > model.maxTokens) return false;

                return true;
            })
            .sort((a, b) => {
                // Preferred provider gets highest priority
                if (request.preferredProvider) {
                    if (a.provider === request.preferredProvider) return -1;
                    if (b.provider === request.preferredProvider) return 1;
                }
                
                // Then sort by priority
                return b.priority - a.priority;
            });
    }

    private async callModel(model: AIModelConfig, request: AIRequest): Promise<AIResponse> {
        if (model.isLocal) {
            return this.callLocalModel(model, request);
        }
        return this.callRemoteModel(model, request);
    }

    private async callLocalModel(model: AIModelConfig, request: AIRequest): Promise<AIResponse> {
        // Example integration with local model server
        const response = await fetch(`http://localhost:${model.endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`Local model ${model.id} failed: ${response.statusText}`);
        }

        const result = await response.json();
        return {
            content: result.content,
            provider: model.provider,
            model: model.id,
            tokensUsed: result.tokens
        };
    }

    private async callRemoteModel(model: AIModelConfig, request: AIRequest): Promise<AIResponse> {
        if (!model.apiKey) {
            throw new Error(`API key required for model ${model.id}`);
        }

        // Example remote API call
        const response = await fetch(model.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${model.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model.id,
                ...this.formatRequestForProvider(model.provider, request)
            })
        });

        if (!response.ok) {
            throw new Error(`Remote model ${model.id} failed: ${response.statusText}`);
        }

        const result = await response.json();
        return this.formatResponseFromProvider(model.provider, result);
    }

    private formatRequestForProvider(provider: string, request: AIRequest): any {
        switch (provider) {
            case 'openai':
                return {
                    messages: [{
                        role: 'user',
                        content: request.content
                    }],
                    max_tokens: request.maxTokens,
                    temperature: request.temperature
                };
            case 'anthropic':
                return {
                    prompt: request.content,
                    max_tokens_to_sample: request.maxTokens,
                    temperature: request.temperature
                };
            // Add more providers as needed
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    private formatResponseFromProvider(provider: string, response: any): AIResponse {
        switch (provider) {
            case 'openai':
                return {
                    content: response.choices[0].message.content,
                    provider: 'openai',
                    model: response.model,
                    tokensUsed: response.usage.total_tokens,
                    cost: this.calculateOpenAICost(response.model, response.usage.total_tokens)
                };
            case 'anthropic':
                return {
                    content: response.completion,
                    provider: 'anthropic',
                    model: response.model,
                    tokensUsed: response.tokens
                };
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    private calculateOpenAICost(model: string, tokens: number): number {
        // Add pricing logic here
        return 0; // Placeholder
    }
}

// Example usage:
const gateway = new AIGateway();

// Register models
gateway.registerModel({
    id: 'gpt-4',
    provider: 'openai',
    type: 'chat',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    apiKey: 'your-openai-key',
    priority: 90,
    capabilities: ['code', 'reasoning', 'math'],
    contextWindow: 8192,
    maxTokens: 4096,
    isLocal: false
});

gateway.registerModel({
    id: 'local-codellama',
    provider: 'local',
    type: 'completion',
    endpoint: '3000',
    priority: 80,
    capabilities: ['code'],
    contextWindow: 4096,
    maxTokens: 2048,
    isLocal: true
});

// Use gateway
const response = await gateway.process({
    type: 'completion',
    content: 'Complete this code: function validateUser(',
    maxTokens: 100,
    temperature: 0.3,
    requiredCapabilities: ['code'],
    preferredProvider: 'local'
});
