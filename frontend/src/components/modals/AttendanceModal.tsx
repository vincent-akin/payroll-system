// src/components/modals/AttendanceModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { attendanceService } from '@/lib/api/attendance';
import toast from 'react-hot-toast';

const attendanceSchema = z.object({
  attendanceDate: z.string().min(1, 'Date is required'),
  checkIn: z.string().min(1, 'Check-in time is required'),
  checkOut: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AttendanceModal({ isOpen, onClose, onSuccess }: AttendanceModalProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      attendanceDate: new Date().toISOString().split('T')[0],
      checkIn: '09:00',
      checkOut: '17:00',
    },
  });

  const onSubmit = async (data: AttendanceFormData) => {
    setLoading(true);
    try {
      // Format date properly for backend
      const date = new Date(data.attendanceDate);
      const checkInTime = data.checkIn;
      const checkOutTime = data.checkOut;

      // Create proper Date objects
      const checkInDate = new Date(`${data.attendanceDate}T${checkInTime}:00`);
      const checkOutDate = checkOutTime ? new Date(`${data.attendanceDate}T${checkOutTime}:00`) : null;

      // Calculate worked hours
      let workedHours = 0;
      if (checkOutDate) {
        const diffMs = checkOutDate.getTime() - checkInDate.getTime();
        workedHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
      }

      const payload = {
        attendanceDate: date.toISOString(),
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate ? checkOutDate.toISOString() : null,
        status: 'PRESENT',
        workedHours: workedHours,
        overtimeHours: 0,
        lateMinutes: 0,
        workflowStatus: 'DRAFT',
        isPayrollProcessed: false,
      };

      console.log('📤 Submitting attendance:', JSON.stringify(payload, null, 2));
      
      const response = await attendanceService.createAttendance(payload);
      console.log('✅ Attendance response:', response);
      
      toast.success('Attendance marked successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('❌ Attendance error:', error);
      console.error('❌ Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <Input
              type="date"
              {...register('attendanceDate')}
              className={errors.attendanceDate ? 'border-red-500' : ''}
            />
            {errors.attendanceDate && (
              <p className="text-red-500 text-sm mt-1">{errors.attendanceDate.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check In
              </label>
              <Input
                type="time"
                {...register('checkIn')}
                className={errors.checkIn ? 'border-red-500' : ''}
              />
              {errors.checkIn && (
                <p className="text-red-500 text-sm mt-1">{errors.checkIn.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check Out
              </label>
              <Input
                type="time"
                {...register('checkOut')}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Mark Attendance'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}