import { RoleEnum } from '../common/enums/user.enum.js';
import { forbiddenException } from '../common/response/response.js';

export const authorize =
  (authorizedRoles = RoleEnum.User) =>
  (req, res, next) => {
    const matchedRole =
      typeof authorizedRoles !== 'object'
        ? authorizedRoles === req.userRole
        : authorizedRoles.includes(req.userRole) || false;

    // note to self: I think if I was using express v4
    // I would have to use next(err) and not just throw
    // an error
    if (!matchedRole)
      return forbiddenException("You don't have enough permissions");

    next();
  };
