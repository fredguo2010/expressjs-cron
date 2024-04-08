const allRoles = {
  user: ['gets'],
  admin: ['gets', 'manages', 'getDicts', 'manageDicts'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
