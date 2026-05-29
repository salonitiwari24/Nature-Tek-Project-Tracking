import { SetMetadata } from '@nestjs/common';
import type { SystemRole } from '@nature-tek/database';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: SystemRole[]) => SetMetadata(ROLES_KEY, roles);
