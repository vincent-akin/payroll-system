// backend/src/modules/notifications/notification.controller.js
import * as notificationService from './notification.service.js';

export const getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getNotifications(req.user.id, req.query);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.getNotification(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    await notificationService.deleteNotification(id, req.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const deleteAllNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.deleteAllNotifications(req.user.id);
    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};