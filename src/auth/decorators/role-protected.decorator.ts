import { SetMetadata } from '@nestjs/common';

import { Role } from '@auth/enums/role.enum';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: Role[]) => SetMetadata(META_ROLES, args);
