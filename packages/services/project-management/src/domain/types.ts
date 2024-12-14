export interface Project {
  id: string;
  name: string;
  description?: string;
  stage: ProjectStage;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStage {
  PROPOSAL = 'PROPOSAL',
  PLANNING = 'PLANNING',
  IMPLEMENTATION = 'IMPLEMENTATION',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED'
}

export interface TeamMember {
  id: string;
  roles: string[];
  joinedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: MilestoneStatus;
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}