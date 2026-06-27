// src/lib/hooks/usePermissions.ts
import { useAuth } from './useAuth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user?.role?.permissions) return false;
    return user.role.permissions.includes(permission);
  };

  const hasRole = (roleName: string): boolean => {
    if (!user?.role?.name) return false;
    return user.role.name === roleName;
  };

  const isSuperAdmin = (): boolean => {
    return hasRole('SUPER_ADMIN');
  };

  const isHRManager = (): boolean => {
    return hasRole('HR_MANAGER');
  };

  const isPayrollOfficer = (): boolean => {
    return hasRole('PAYROLL_OFFICER');
  };

  const isFinanceOfficer = (): boolean => {
    return hasRole('FINANCE_OFFICER');
  };

  const isEmployee = (): boolean => {
    return hasRole('EMPLOYEE');
  };

  return {
    hasPermission,
    hasRole,
    isSuperAdmin,
    isHRManager,
    isPayrollOfficer,
    isFinanceOfficer,
    isEmployee,
  };
};