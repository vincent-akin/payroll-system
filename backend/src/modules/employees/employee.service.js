import Employee from './employee.model.js';
import Department from '../departments/department.model.js';
import Organization from '../organizations/organization.model.js';
import AppError from '../../shared/errors/AppError.js';

const generateEmployeeNumber = async () => {
  const count = await Employee.countDocuments();

  return `EMP${String(count + 1).padStart(4, '0')}`;
};

export const createEmployee = async (payload) => {
  if (!payload.organizationId) {
    throw new AppError('Organization ID is required', 400);
  }

  if (!payload.departmentId) {
    throw new AppError('Department ID is required', 400);
  }

  if (!payload.firstName) {
    throw new AppError('First name is required', 400);
  }

  if (!payload.lastName) {
    throw new AppError('Last name is required', 400);
  }

  if (!payload.email) {
    throw new AppError('Email is required', 400);
  }

  if (!payload.jobTitle) {
    throw new AppError('Job title is required', 400);
  }

  if (!payload.hireDate) {
    payload.hireDate = new Date();
  }

  if (!payload.employeeNumber || payload.employeeNumber.trim() === '') {
    payload.employeeNumber = await generateEmployeeNumber();
  }

  payload.employeeNumber = payload.employeeNumber.toUpperCase().trim();

  if (payload.employmentType) {
    payload.employmentType = payload.employmentType
      .replace(/\s+/g, '_')
      .toUpperCase();
  }

  if (payload.gender) {
    payload.gender = payload.gender.toUpperCase();
  }

  if (payload.status) {
    payload.status = payload.status.toUpperCase();
  }

  const existingEmployee = await Employee.findOne({
    employeeNumber: payload.employeeNumber
  });

  if (existingEmployee) {
    throw new AppError('Employee number already exists', 409);
  }

  const organization = await Organization.findById(payload.organizationId);

  if (!organization) {
    throw new AppError('Organization not found', 404);
  }

  const department = await Department.findById(payload.departmentId);

  if (!department) {
    throw new AppError('Department not found', 404);
  }

  return await Employee.create(payload);
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
    throw new AppError('Employee not found', 404);
  }

  return employee;
};

export const updateEmployee = async (id, payload) => {
  if (payload.employeeNumber) {
    payload.employeeNumber = payload.employeeNumber.toUpperCase().trim();
  }

  if (payload.employmentType) {
    payload.employmentType = payload.employmentType
      .replace(/\s+/g, '_')
      .toUpperCase();
  }

  if (payload.gender) {
    payload.gender = payload.gender.toUpperCase();
  }

  if (payload.status) {
    payload.status = payload.status.toUpperCase();
  }

  const employee = await Employee.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  });

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  return employee;
};

export const deleteEmployee = async (id) => {
  const employee = await Employee.findById(id);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  await employee.deleteOne();

  return true;
};