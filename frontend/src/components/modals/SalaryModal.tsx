// src/components/modals/SalaryModal.tsx
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { salaryService } from '@/lib/api/salary';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

const allowanceSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  description: z.string().optional(),
});

const salarySchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  basicSalary: z.number().min(0, 'Basic salary must be positive'),
  allowances: z.array(allowanceSchema).optional(),
  effectiveDate: z.string().min(1, 'Effective date is required'),
});

type SalaryFormData = z.infer<typeof salarySchema>;

interface SalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SalaryModal({ isOpen, onClose, onSuccess }: SalaryModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      allowances: [{ type: '', amount: 0, description: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'allowances',
  });

  const onSubmit = async (data: SalaryFormData) => {
    setLoading(true);
    try {
      // Calculate gross salary
      const totalAllowances = data.allowances?.reduce((sum, a) => sum + a.amount, 0) || 0;
      const grossSalary = data.basicSalary + totalAllowances;

      // Build payload matching backend expectations
      const payload = {
        employeeId: data.employeeId,
        basicSalary: data.basicSalary,
        allowances: data.allowances || [],
        grossSalary: grossSalary,
        effectiveDate: data.effectiveDate,
        status: 'DRAFT',
        version: 1,
      };

      console.log('📤 Sending salary structure:', payload);
      const response = await salaryService.createSalaryStructure(payload);
      console.log('✅ Response:', response);
      
      toast.success('Salary structure created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || 'Failed to create salary structure');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Salary Structure</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <Input
              placeholder="Enter employee ID"
              {...register('employeeId')}
              className={errors.employeeId ? 'border-red-500' : ''}
            />
            {errors.employeeId && (
              <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basic Salary
            </label>
            <Input
              type="number"
              placeholder="0.00"
              {...register('basicSalary', { valueAsNumber: true })}
              className={errors.basicSalary ? 'border-red-500' : ''}
            />
            {errors.basicSalary && (
              <p className="text-red-500 text-sm mt-1">{errors.basicSalary.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Effective Date
            </label>
            <Input
              type="date"
              {...register('effectiveDate')}
              className={errors.effectiveDate ? 'border-red-500' : ''}
            />
            {errors.effectiveDate && (
              <p className="text-red-500 text-sm mt-1">{errors.effectiveDate.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Allowances
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ type: '', amount: 0, description: '' })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Allowance
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  placeholder="Type"
                  {...register(`allowances.${index}.type`)}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  {...register(`allowances.${index}.amount`, { valueAsNumber: true })}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Description"
                    {...register(`allowances.${index}.description`)}
                  />
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Structure'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}