export const isAuthorized = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.role || !allowedRoles.includes(req.role)) {
            return res.status(403).json({
                message: `Access denied: Only ${allowedRoles.join(" or ")} accounts can perform this action`,
                success: false
            });
        }
        next();
    };
};
