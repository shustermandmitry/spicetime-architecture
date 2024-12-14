import { Project, TeamMember } from '../../domain/types';
import { ProjectRepository, TeamMemberRepository } from '../../domain/repositories';

export class NextCloudAdapter implements ProjectRepository, TeamMemberRepository {
  constructor(private readonly nextCloudClient: any) {} // Will be properly typed later

  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    // Implementation will come later
    throw new Error('Not implemented');
  }

  async findById(id: string): Promise<Project | null> {
    throw new Error('Not implemented');
  }

  async findAll(): Promise<Project[]> {
    throw new Error('Not implemented');
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async addToProject(projectId: string, member: Omit<TeamMember, 'joinedAt'>): Promise<TeamMember> {
    throw new Error('Not implemented');
  }

  async removeFromProject(projectId: string, memberId: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async findByProjectId(projectId: string): Promise<TeamMember[]> {
    throw new Error('Not implemented');
  }
}