export const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const { user_id } = req.user;
      const { permissions } = await RBACService.getUserRolesPermissions(req.db, user_id);
      if (!permissions.some(p => p.name === permissionName)) {
        return res.status(403).json({ message: "Forbidden: insufficient permissions" });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to check permissions" });
    }
  };
};
