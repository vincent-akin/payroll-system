import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} from './employee.service.js';

export const createEmployeeController =
  async (req, res, next) => {
    try {
      const employee =
        await createEmployee(req.body);

      res.status(201).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  };

export const getEmployeesController =
  async (req, res, next) => {
    try {
      const filters = {};

      if (req.query.organizationId) {
        filters.organizationId =
          req.query.organizationId;
      }

      if (req.query.departmentId) {
        filters.departmentId =
          req.query.departmentId;
      }

      if (req.query.status) {
        filters.status =
          req.query.status;
      }

      const employees =
        await getEmployees(filters);

      res.status(200).json({
        success: true,
        data: employees
      });
    } catch (error) {
      next(error);
    }
  };

export const getEmployeeController =
  async (req, res, next) => {
    try {
      const employee =
        await getEmployeeById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  };

export const updateEmployeeController =
  async (req, res, next) => {
    try {
      const employee =
        await updateEmployee(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  };

export const deleteEmployeeController =
  async (req, res, next) => {
    try {
      await deleteEmployee(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          'Employee deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };