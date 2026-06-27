// src/app/(dashboard)/attendance/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { attendanceService } from '@/lib/api/attendance';
import { Attendance } from '@/types';
import { formatDate, getStatusColor } from '@/lib/utils';
import { AttendanceModal } from '@/components/modals/AttendanceModal';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isEmployee } = usePermissions();

  useEffect(() => {
    fetchAttendances();
  }, []);

  const fetchAttendances = async () => {
    try {
      const response = await attendanceService.getAttendances();
      if (response.success && response.data) {
        setAttendances(response.data.data || []);
      } else {
        setAttendances([]);
      }
    } catch (error) {
      console.error('Failed to fetch attendances:', error);
      setAttendances([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
        {isEmployee() && (
          <Button onClick={() => setModalOpen(true)}>Mark Attendance</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : attendances.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No attendance records found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendances.map((attendance) => (
                  <TableRow key={attendance._id}>
                    <TableCell>
                      {attendance.employee?.user?.firstName}{' '}
                      {attendance.employee?.user?.lastName}
                    </TableCell>
                    <TableCell>{formatDate(attendance.attendanceDate)}</TableCell>
                    <TableCell>
                      {attendance.checkIn
                        ? new Date(attendance.checkIn).toLocaleTimeString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {attendance.checkOut
                        ? new Date(attendance.checkOut).toLocaleTimeString()
                        : '-'}
                    </TableCell>
                    <TableCell>{attendance.workedHours?.toFixed(1) || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          attendance.status
                        )}`}
                      >
                        {attendance.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AttendanceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchAttendances}
      />
    </div>
  );
}