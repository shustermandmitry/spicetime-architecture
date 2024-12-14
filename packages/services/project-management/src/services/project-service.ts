import { Project, ProjectStage, TeamMember } from '../domain/types';
import { ProjectRepository, TeamMemberRepository } from '../domain/repositories';

export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly teamMemberRepo: TeamMemberRepository
  ) {}

  async createProject(data: {
    name: string;
    description?: string;
    stage?: ProjectStage;
  }): Promise<Project> {
    return this.projectRepo.create({
      name: data.name,
      description: data.description,
      stage: data.stage || ProjectStage.PROPOSAL
    });
  }

  async getProject(id: string): Promise<Project | null> {
    return this.projectRepo.findById(id);
  }

  async updateProjectStage(id: string, stage: ProjectStage): Promise<Project> {
    return this.projectRepo.update(id, { stage });
  }

  async addTeamMember(projectId: string, memberId: string, roles: string[]): Promise<TeamMember> {
    return this.teamMemberRepo.addToProject(projectId, { id: memberId, roles });
  }

  async getProjectTeam(projectId: string): Promise<TeamMember[]> {
    return this.teamMemberRepo.findByProjectId(projectId);
  }
}