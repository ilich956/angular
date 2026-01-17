/**
 * Team Member Model
 */
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  avatar?: string;
  department?: string;
  projectsCount: number;
  tasksCount: number;
  joinedAt: string;
  status: MemberStatus;
}

export enum TeamRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  QA = 'qa',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
}
