export const adminOnly = (req, res, next) => {
  // Check if user exists and has admin role
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  // If admin, continue to the next middleware/controller
  next();
};