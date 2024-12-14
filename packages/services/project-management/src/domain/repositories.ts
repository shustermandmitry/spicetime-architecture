import { Project, TeamMember } from './types';

export interface ProjectRepository {
  create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  update(id: string, project: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
}

export interface TeamMemberRepository {
  addToProject(projectId: string, member: Omit<TeamMember, 'joinedAt'>): Promise<TeamMember>;
  removeFromProject(projectId: string, memberId: string): Promise<void>;
  findByProjectId(projectId: string): Promise<TeamMember[]>;
}