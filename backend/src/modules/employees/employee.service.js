import Employee from './employee.model.js';
import Department from '../departments/department.model.js';
import Organization from '../organizations/organization.model.js';
import AppError from '../../shared/errors/AppError.js';

export const createEmployee = async (payload) => {
  const existingEmployee = await Employee.findOne({
    employeeNumber: payload.employeeNumber.toUpperCase()
  });

  if (existingEmployee) {
    throw new AppError(
      'Employee number already exists',
      409
    );
  }

  const organization = await Organization.findById(
    payload.organizationId
  );

  if (!organization) {
    throw new AppError(
      'Organization not found',
      404
    );
  }

  const department = await Department.findById(
    payload.departmentId
  );

  if (!department) {
    throw new AppError(
      'Department not found',
      404
    );
  }

  return Employee.create({
    ...payload,
    employeeNumber:
      payload.employeeNumber.toUpperCase()
  });
};

export const getEmployees = async (filters = {}) => {
  return Employee.find(filters)
    .populate('organizationId', 'name code')
    .populate('departmentId', 'name code')
    .populate('userId', 'email')
    .sort({ createdAt: -1 });
};

export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate('organizationId', 'name code')
    .populate('departmentId', 'name code')
    .populate('userId', 'email');

  if (!employee) {
    throw new AppError(
      'Employee not found',
      404
    );
  }

  return employee;
};

export const updateEmployee = async (
  id,
  payload
) => {
  const employee =
    await Employee.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true
      }
    );

  if (!employee) {
    throw new AppError(
      'Employee not found',
      404
    );
  }

  return employee;
};

export const deleteEmployee = async (id) => {
  const employee = await Employee.findById(id);

  if (!employee) {
    throw new AppError(
      'Employee not found',
      404
    );
  }

  await employee.deleteOne();

  return true;
};