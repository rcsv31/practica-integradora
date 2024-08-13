export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Acceso denegado" });
};

export const isUser = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "user") {
    return next();
  }
  res.status(403).json({ message: "Acceso denegado" });
};
