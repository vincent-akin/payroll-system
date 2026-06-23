// backend/src/modules/deductions/deduction.service.js
import { Deduction } from './deduction.model.js';
import AppError from '../../shared/errors/AppError.js';
import logger from '../../shared/utils/logger.js';

export const createDeduction = async (data, userId) => {
  try {
    const deduction = new Deduction({
      ...data,
      createdBy: userId,
      status: 'DRAFT'
    });
    await deduction.save();
    logger.info(`Deduction created: ${deduction._id} for employee ${data.employeeId}`);
    return deduction;
  } catch (error) {
    logger.error('Error creating deduction:', error);
    throw new AppError('Failed to create deduction', 500);
  }
};

export const activateDeduction = async (deductionId, userId) => {
  const deduction = await Deduction.findById(deductionId);
  if (!deduction) {
    throw new AppError('Deduction not found', 404);
  }

  if (deduction.status !== 'DRAFT') {
    throw new AppError('Only DRAFT deductions can be activated', 400);
  }

  const now = new Date();
  if (deduction.effectiveFrom > now) {
    throw new AppError('Cannot activate deduction before effectiveFrom date', 400);
  }

  deduction.status = 'ACTIVE';
  deduction.approvedBy = userId;
  deduction.approvedAt = now;
  await deduction.save();

  logger.info(`Deduction activated: ${deductionId}`);
  return deduction;
};

export const deactivateDeduction = async (deductionId) => {
  const deduction = await Deduction.findById(deductionId);
  if (!deduction) {
    throw new AppError('Deduction not found', 404);
  }

  if (deduction.status !== 'ACTIVE') {
    throw new AppError('Only ACTIVE deductions can be deactivated', 400);
  }

  deduction.status = 'INACTIVE';
  deduction.effectiveTo = new Date();
  await deduction.save();

  logger.info(`Deduction deactivated: ${deductionId}`);
  return deduction;
};

export const getEmployeeDeductions = async (employeeId, options = {}) => {
  const { status, type, page = 1, limit = 20 } = options;
  const filter = { employeeId };

  if (status) filter.status = status;
  if (type) filter.type = type;

  const skip = (page - 1) * limit;
  const [deductions, total] = await Promise.all([
    Deduction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('approvedBy', 'firstName lastName email'),
    Deduction.countDocuments(filter)
  ]);

  return {
    data: deductions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getActiveDeductions = async (employeeId) => {
  const now = new Date();
  return Deduction.find({
    employeeId,
    status: 'ACTIVE',
    effectiveFrom: { $lte: now },
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gt: now } }
    ]
  }).sort({ effectiveFrom: -1 });
};

export const getDeduction = async (deductionId) => {
  const deduction = await Deduction.findById(deductionId)
    .populate('employeeId', 'firstName lastName employeeCode')
    .populate('approvedBy', 'firstName lastName email')
    .populate('createdBy', 'firstName lastName email');
  
  if (!deduction) {
    throw new AppError('Deduction not found', 404);
  }
  return deduction;
};

export const updateDeduction = async (deductionId, data) => {
  const deduction = await Deduction.findById(deductionId);
  if (!deduction) {
    throw new AppError('Deduction not found', 404);
  }

  if (deduction.status === 'ACTIVE') {
    throw new AppError('Cannot update ACTIVE deduction. Deactivate first.', 400);
  }

  Object.assign(deduction, data);
  await deduction.save();

  logger.info(`Deduction updated: ${deductionId}`);
  return deduction;
};

export const deleteDeduction = async (deductionId) => {
  const deduction = await Deduction.findById(deductionId);
  if (!deduction) {
    throw new AppError('Deduction not found', 404);
  }

  if (deduction.status === 'ACTIVE') {
    throw new AppError('Cannot delete ACTIVE deduction. Deactivate first.', 400);
  }

  await deduction.deleteOne();
  logger.info(`Deduction deleted: ${deductionId}`);
};