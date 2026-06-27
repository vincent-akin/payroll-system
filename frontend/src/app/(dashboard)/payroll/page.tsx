// src/app/(dashboard)/payroll/page.tsx
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
import { payrollService } from '@/lib/api/payroll';
import { Payroll } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { PayrollModal } from '@/components/modals/PayrollModal';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isPayrollOfficer, isHRManager, isSuperAdmin } = usePermissions();

  const canGenerate = isPayrollOfficer() || isHRManager() || isSuperAdmin();

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await payrollService.getPayrolls();
      if (response.success && response.data) {
        setPayrolls(response.data.data || []);
      } else {
        setPayrolls([]);
      }
    } catch (error) {
      console.error('Failed to fetch payrolls:', error);
      setPayrolls([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payroll</h1>
        {canGenerate && (
          <Button onClick={() => setModalOpen(true)}>Generate Payroll</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payroll Runs</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : payrolls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payroll records found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Total Basic</TableHead>
                  <TableHead>Total Allowances</TableHead>
                  <TableHead>Total Deductions</TableHead>
                  <TableHead>Total Net</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll) => (
                  <TableRow key={payroll._id}>
                    <TableCell>
                      {formatDate(payroll.periodStart)} -{' '}
                      {formatDate(payroll.periodEnd)}
                    </TableCell>
                    <TableCell>{payroll.employeeIds?.length || 0}</TableCell>
                    <TableCell>{formatCurrency(payroll.totalBasic || 0)}</TableCell>
                    <TableCell>{formatCurrency(payroll.totalAllowances || 0)}</TableCell>
                    <TableCell>{formatCurrency(payroll.totalDeductions || 0)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payroll.totalNetSalary || 0)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          payroll.status
                        )}`}
                      >
                        {payroll.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PayrollModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchPayrolls}
      />
    </div>
  );
}