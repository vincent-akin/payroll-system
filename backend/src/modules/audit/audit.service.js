// backend/src/modules/audit/audit.service.js
import { Audit } from './audit.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';

export const logEvent = async (data) => {
  try {
    const audit = new Audit(data);
    await audit.save();
    return audit;
  } catch (error) {
    logger.error('Error logging audit event:', error);
    // Don't throw to prevent disrupting the main flow
  }
};

export const getAuditLogs = async (options = {}) => {
  const {
    actorId,
    action,
    resource,
    resourceId,
    startDate,
    endDate,
    status,
    page = 1,
    limit = 50
  } = options;

  const filter = {};
  if (actorId) filter.actorId = actorId;
  if (action) filter.action = action;
  if (resource) filter.resource = resource;
  if (resourceId) filter.resourceId = resourceId;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    Audit.find(filter)
      .populate('actorId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Audit.countDocuments(filter)
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getResourceHistory = async (resource, resourceId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    Audit.find({ resource, resourceId })
      .populate('actorId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Audit.countDocuments({ resource, resourceId })
  ]);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getUserActivity = async (userId, options = {}) => {
  const { startDate, endDate, page = 1, limit = 20 } = options;
  const filter = { actorId: userId };

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    Audit.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Audit.countDocuments(filter)
  ]);

  // Group by action for summary
  const actionSummary = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  return {
    data: logs,
    summary: {
      totalActivities: total,
      actionSummary
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getAuditStats = async (options = {}) => {
  const { startDate, endDate } = options;
  const filter = {};
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const [total, byAction, byResource, byStatus, byUser] = await Promise.all([
    Audit.countDocuments(filter),
    Audit.aggregate([
      { $match: filter },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Audit.aggregate([
      { $match: filter },
      { $group: { _id: '$resource', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Audit.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Audit.aggregate([
      { $match: filter },
      { $group: { _id: '$actorId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  return {
    total,
    byAction,
    byResource,
    byStatus,
    topUsers: byUser
  };
};

// Helper functions to create audit logs for common actions
export const auditEmployeeAction = async (actorId, action, employeeId, metadata = {}, ipAddress) => {
  return logEvent({
    actorId,
    action,
    resource: 'EMPLOYEE',
    resourceId: employeeId,
    metadata,
    ipAddress
  });
};

export const auditPayrollAction = async (actorId, action, payrollId, metadata = {}, ipAddress) => {
  return logEvent({
    actorId,
    action,
    resource: 'PAYROLL',
    resourceId: payrollId,
    metadata,
    ipAddress
  });
};

export const auditLeaveAction = async (actorId, action, leaveId, metadata = {}, ipAddress) => {
  return logEvent({
    actorId,
    action,
    resource: 'LEAVE',
    resourceId: leaveId,
    metadata,
    ipAddress
  });
};

export const auditDeductionAction = async (actorId, action, deductionId, metadata = {}, ipAddress) => {
  return logEvent({
    actorId,
    action,
    resource: 'DEDUCTION',
    resourceId: deductionId,
    metadata,
    ipAddress
  });
};