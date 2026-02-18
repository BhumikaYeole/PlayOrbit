export const allowPlayer = (req, res, next) => {
  if (req.user.role !== "player")
    return res.status(403).json({ msg: "Player only" });
  next();
};


export const allowProvider = (req, res, next) => {
  if (req.user.role !== "provider")
    return res.status(403).json({ msg: "Provider only" });
  next();
};