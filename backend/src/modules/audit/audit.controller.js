// backend/src/modules/audit/audit.controller.js
import * as auditService from './audit.service.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const result = await auditService.getAuditLogs(req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getResourceHistory = async (req, res, next) => {
  try {
    const { resource, resourceId } = req.params;
    const result = await auditService.getResourceHistory(resource, resourceId, req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getUserActivity = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await auditService.getUserActivity(userId, req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditStats = async (req, res, next) => {
  try {
    const stats = await auditService.getAuditStats(req.query);
    res.status(200).json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};