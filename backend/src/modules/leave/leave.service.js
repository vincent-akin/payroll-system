import Leave from './leave.model.js';
import AppError from '../../shared/errors/AppError.js';

const calculateDays = (
  startDate,
  endDate
) => {
  const diff =
    new Date(endDate) -
    new Date(startDate);

  return (
    Math.floor(
      diff / 86400000
    ) + 1
  );
};

export const createLeave =
  async (
    payload,
    userId
  ) => {
    const totalDays =
      calculateDays(
        payload.startDate,
        payload.endDate
      );

    return Leave.create({
      ...payload,
      totalDays,
      createdBy: userId
    });
  };

export const approveLeave =
  async (
    id,
    userId
  ) => {
    return Leave.findByIdAndUpdate(
      id,
      {
        status: 'APPROVED',
        approvedBy: userId,
        approvedAt:
          new Date()
      },
      {
        new: true
      }
    );
  };

export const rejectLeave =
  async (
    id,
    reason
  ) => {
    return Leave.findByIdAndUpdate(
      id,
      {
        status: 'REJECTED',
        rejectionReason:
          reason
      },
      {
        new: true
      }
    );
  };

export const getLeaves =
  async () => {
    return Leave.find()
      .populate(
        'employeeId'
      )
      .sort({
        createdAt: -1
      });
  };

export const getLeave =
  async (id) => {
    return Leave.findById(id);
  };