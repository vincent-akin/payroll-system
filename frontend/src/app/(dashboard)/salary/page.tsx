// src/app/(dashboard)/salary/page.tsx
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
import { salaryService } from '@/lib/api/salary';
import { SalaryStructure } from '@/types';
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils';
import { SalaryModal } from '@/components/modals/SalaryModal';
import { usePermissions } from '@/lib/hooks/usePermissions';

export default function SalaryPage() {
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { isHRManager, isSuperAdmin } = usePermissions();

  const canCreate = isHRManager() || isSuperAdmin();

  useEffect(() => {
    fetchSalaryStructures();
  }, []);

  const fetchSalaryStructures = async () => {
    try {
      const response = await salaryService.getSalaryStructures();
      if (response.success && response.data) {
        setSalaryStructures(response.data.data || []);
      } else {
        setSalaryStructures([]);
      }
    } catch (error) {
      console.error('Failed to fetch salary structures:', error);
      setSalaryStructures([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Salary Structures</h1>
        {canCreate && (
          <Button onClick={() => setModalOpen(true)}>Create Salary Structure</Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Salary Structures</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : salaryStructures.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No salary structures found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Basic Salary</TableHead>
                  <TableHead>Allowances</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Effective Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryStructures.map((structure) => (
                  <TableRow key={structure._id}>
                    <TableCell>
                      {structure.employee?.user?.firstName}{' '}
                      {structure.employee?.user?.lastName}
                    </TableCell>
                    <TableCell>{formatCurrency(structure.basicSalary)}</TableCell>
                    <TableCell>
                      {structure.allowances?.reduce(
                        (sum, a) => sum + a.amount,
                        0
                      ) || 0}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(structure.grossSalary)}
                    </TableCell>
                    <TableCell>{formatDate(structure.effectiveDate)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          structure.status
                        )}`}
                      >
                        {structure.status}
                      </span>
                    </TableCell>
                    <TableCell>v{structure.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <SalaryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchSalaryStructures}
      />
    </div>
  );
}