import {
  ADMIN_ACCESS_SIGNATURE,
  ADMIN_REFRESH_SIGNATURE,
  USER_ACCESS_SIGNATURE,
  USER_REFRESH_SIGNATURE,
} from '../../../config/index.js';
import { RoleEnum } from '../../enums/user.enum.js';

export const getSignature = (userRole = RoleEnum.User) => {
  let accessSignature = '';
  let refreshSignature = '';
  switch (userRole) {
    case RoleEnum.User:
      accessSignature = USER_ACCESS_SIGNATURE;
      refreshSignature = USER_REFRESH_SIGNATURE;
      break;
    case RoleEnum.Admin:
      accessSignature = ADMIN_ACCESS_SIGNATURE;
      refreshSignature = ADMIN_REFRESH_SIGNATURE;
      break;
  }

  return { accessSignature, refreshSignature };
};
