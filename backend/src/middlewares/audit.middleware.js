import { auditLog } from "../utils/auditLogger.js";

export function createAudit(action) {
    return async (req, res, next) => {
        req.auditAction = action;
        next();
    };
}
