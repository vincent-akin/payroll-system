// backend/src/modules/notifications/notification.service.js
import { Notification } from './notification.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';

export const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    logger.info(`Notification created for user ${data.userId}: ${data.type}`);
    return notification;
  } catch (error) {
    logger.error('Error creating notification:', error);
    throw new AppError('Failed to create notification', 500);
  }
};

export const createBulkNotifications = async (notifications) => {
  try {
    const result = await Notification.insertMany(notifications);
    logger.info(`Created ${result.length} notifications`);
    return result;
  } catch (error) {
    logger.error('Error creating bulk notifications:', error);
    throw new AppError('Failed to create notifications', 500);
  }
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, read: false },
    { read: true, readAt: new Date() }
  );

  logger.info(`Marked ${result.modifiedCount} notifications as read for user ${userId}`);
  return { modifiedCount: result.modifiedCount };
};

export const getNotifications = async (userId, options = {}) => {
  const { read, type, priority, page = 1, limit = 20 } = options;
  const filter = { userId };

  if (read !== undefined) filter.read = read;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;

  const skip = (page - 1) * limit;
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ userId, read: false })
  ]);

  return {
    data: notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getNotification = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, userId });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  return notification;
};

export const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }
  logger.info(`Notification ${notificationId} deleted`);
};

export const deleteAllNotifications = async (userId) => {
  const result = await Notification.deleteMany({ userId });
  logger.info(`Deleted ${result.deletedCount} notifications for user ${userId}`);
  return { deletedCount: result.deletedCount };
};

// Helper functions for common notification types
export const notifyLeaveApproved = async (userId, leaveData) => {
  return createNotification({
    userId,
    type: 'LEAVE_APPROVED',
    title: 'Leave Request Approved',
    message: `Your leave request from ${leaveData.startDate} to ${leaveData.endDate} has been approved.`,
    data: { leave: leaveData },
    priority: 'HIGH',
    link: '/leaves',
    sourceId: leaveData._id,
    sourceType: 'Leave'
  });
};

export const notifyLeaveRejected = async (userId, leaveData) => {
  return createNotification({
    userId,
    type: 'LEAVE_REJECTED',
    title: 'Leave Request Rejected',
    message: `Your leave request from ${leaveData.startDate} to ${leaveData.endDate} has been rejected. Reason: ${leaveData.rejectionReason || 'Not specified'}`,
    data: { leave: leaveData },
    priority: 'HIGH',
    link: '/leaves',
    sourceId: leaveData._id,
    sourceType: 'Leave'
  });
};

export const notifyPayrollApproved = async (userId, payrollData) => {
  return createNotification({
    userId,
    type: 'PAYROLL_APPROVED',
    title: 'Payroll Approved',
    message: `Your payroll for ${payrollData.period.month}/${payrollData.period.year} has been approved.`,
    data: { payroll: payrollData },
    priority: 'HIGH',
    link: '/payroll',
    sourceId: payrollData._id,
    sourceType: 'Payroll'
  });
};

export const notifyPayrollPaid = async (userId, payrollData) => {
  return createNotification({
    userId,
    type: 'PAYROLL_PAID',
    title: 'Payroll Paid',
    message: `Your salary for ${payrollData.period.month}/${payrollData.period.year} has been paid.`,
    data: { payroll: payrollData },
    priority: 'URGENT',
    link: '/payroll',
    sourceId: payrollData._id,
    sourceType: 'Payroll'
  });
};