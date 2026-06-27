// src/components/modals/EmployeeModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { employeeService } from '@/lib/api/employee';
import { departmentService } from '@/lib/api/department';
import toast from 'react-hot-toast';

interface Department {
  _id: string;
  name: string;
  code: string;
  organizationId: string;
}

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  position: z.string().min(2, 'Position is required'),
  departmentId: z.string().min(1, 'Department is required'),
  employmentType: z.string().default('FULL_TIME'),
  employeeNumber: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultOrganizationId?: string;
}

export function EmployeeModal({ isOpen, onClose, onSuccess, defaultOrganizationId }: EmployeeModalProps) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      position: '',
      departmentId: '',
      employmentType: 'FULL_TIME',
    },
  });

  useEffect(() => {
    if (isOpen && defaultOrganizationId) {
      fetchDepartments(defaultOrganizationId);
    }
  }, [isOpen, defaultOrganizationId]);

  const fetchDepartments = async (organizationId: string) => {
    setLoadingDepts(true);
    try {
      const response = await departmentService.getDepartments({
        organizationId,
      });

      console.log("Departments Response:", response);

      // Handle the response correctly based on your API structure
      let departmentsData: Department[] = [];
      
      if (response?.success && response?.data) {
        // If response has success and data properties
        departmentsData = Array.isArray(response.data) ? response.data : [];
      } else if (Array.isArray(response)) {
        // If response itself is an array
        departmentsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        // If response has a data property that's an array
        departmentsData = response.data;
      }

      setDepartments(departmentsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load departments");
    } finally {
      setLoadingDepts(false);
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    setLoading(true);

    try {
      const employeeNumber = data.employeeNumber?.trim() || `EMP${Date.now().toString().slice(-6)}`;

      const payload = {
        employeeNumber: employeeNumber,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim().toLowerCase(),
        position: data.position.trim(),
        organizationId: defaultOrganizationId,
        departmentId: data.departmentId,
        employmentType: data.employmentType.replace(/\s+/g, "_").toUpperCase(),
        isActive: true,
        joinDate: new Date().toISOString(),
      };

      console.log('📤 Submitting employee:', JSON.stringify(payload, null, 2));

      await employeeService.createEmployee(payload);

      toast.success('Employee added successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
        "Failed to add employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <Input
                placeholder="John"
                {...register('firstName')}
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <Input
                placeholder="Doe"
                {...register('lastName')}
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <Input
              type="email"
              placeholder="john@company.com"
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <Input
              placeholder="Software Engineer"
              {...register('position')}
              className={errors.position ? 'border-red-500' : ''}
            />
            {errors.position && (
              <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              {...register('departmentId')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loadingDepts || !defaultOrganizationId}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {errors.departmentId && (
              <p className="text-red-500 text-sm mt-1">{errors.departmentId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Type
            </label>
            <select
              {...register('employmentType')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACTOR">Contractor</option>
              <option value="INTERN">Intern</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Number (Optional)
            </label>
            <Input
              placeholder="EMP0001 (Auto-generated if empty)"
              {...register('employeeNumber')}
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}