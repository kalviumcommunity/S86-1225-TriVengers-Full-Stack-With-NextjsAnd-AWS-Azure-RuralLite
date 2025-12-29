// Role and permission mapping for RBAC

const roles = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['read', 'update'],
  viewer: ['read'],
};

module.exports = { roles };