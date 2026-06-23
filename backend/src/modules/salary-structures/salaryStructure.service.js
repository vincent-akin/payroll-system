import SalaryStructure from './salaryStructure.model.js';
import AppError from '../../shared/errors/AppError.js';

const calculateGrossSalary = (
  basicSalary,
  allowances = []
) => {
  const totalAllowances =
    allowances.reduce(
      (sum, item) => sum + item.amount,
      0
    );

  return basicSalary + totalAllowances;
};

export const createSalaryStructure =
  async (payload, userId) => {
    const latest =
      await SalaryStructure
        .findOne({
          employeeId:
            payload.employeeId
        })
        .sort('-version');

    const version =
      latest
        ? latest.version + 1
        : 1;

    const grossSalary =
      calculateGrossSalary(
        payload.basicSalary,
        payload.allowances
      );

    return SalaryStructure.create({
      ...payload,
      version,
      grossSalary,
      createdBy: userId
    });
  };

export const submitSalaryStructure =
  async (id) => {
    return SalaryStructure
      .findByIdAndUpdate(
        id,
        {
          status:
            'SUBMITTED'
        },
        { new: true }
      );
  };

export const approveSalaryStructure =
  async (
    id,
    userId
  ) => {
    const structure =
      await SalaryStructure
        .findById(id);

    if (!structure) {
      throw new AppError(
        'Salary structure not found',
        404
      );
    }

    await SalaryStructure.updateMany(
      {
        employeeId:
          structure.employeeId,
        isCurrent: true
      },
      {
        isCurrent: false,
        effectiveTo:
          structure.effectiveFrom
      }
    );

    structure.status =
      'APPROVED';

    structure.isCurrent =
      true;

    structure.approvedBy =
      userId;

    structure.approvedAt =
      new Date();

    await structure.save();

    return structure;
  };

export const getCurrentSalaryStructure =
  async (employeeId) => {
    return SalaryStructure
      .findOne({
        employeeId,
        isCurrent: true
      });
  };

export const getSalaryHistory =
  async (employeeId) => {
    return SalaryStructure
      .find({
        employeeId
      })
      .sort('-version');
  };