// src/components/modals/PayrollModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { payrollService } from '@/lib/api/payroll';
import toast from 'react-hot-toast';

const payrollSchema = z.object({
  periodStart: z.string().min(1, 'Start date is required'),
  periodEnd: z.string().min(1, 'End date is required'),
  employeeIds: z.string().optional(),
});

type PayrollFormData = z.infer<typeof payrollSchema>;

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayrollModal({ isOpen, onClose, onSuccess }: PayrollModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
  });

  const onSubmit = async (data: PayrollFormData) => {
    setLoading(true);
    try {
      // Parse employee IDs if provided
      let employeeIds: string[] = [];
      if (data.employeeIds && data.employeeIds.trim()) {
        employeeIds = data.employeeIds.split(',').map(id => id.trim()).filter(id => id);
      }

      // Build payload matching backend expectations
      const payload = {
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        employeeIds: employeeIds, // Empty array means all employees
      };

      console.log('📤 Sending payroll generation request:', payload);
      const response = await payrollService.generatePayroll(payload);
      console.log('✅ Response:', response);
      
      toast.success('Payroll generated successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Payroll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period Start
              </label>
              <Input
                type="date"
                {...register('periodStart')}
                className={errors.periodStart ? 'border-red-500' : ''}
              />
              {errors.periodStart && (
                <p className="text-red-500 text-sm mt-1">{errors.periodStart.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period End
              </label>
              <Input
                type="date"
                {...register('periodEnd')}
                className={errors.periodEnd ? 'border-red-500' : ''}
              />
              {errors.periodEnd && (
                <p className="text-red-500 text-sm mt-1">{errors.periodEnd.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee IDs (Optional - Comma separated)
            </label>
            <Input
              placeholder="e.g., emp001, emp002, emp003"
              {...register('employeeIds')}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to generate payroll for all active employees
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate Payroll'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}