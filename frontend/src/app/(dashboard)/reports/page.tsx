// src/app/(dashboard)/reports/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  Users,
  Calendar,
  DollarSign,
  Download,
  Loader2,
} from 'lucide-react';
import { reportsService } from '@/lib/api/reports';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const reports = [
    {
      id: 'payroll-summary',
      title: 'Payroll Summary',
      description: 'Overview of payroll by department',
      icon: DollarSign,
      color: 'bg-blue-500',
      action: async () => {
        setLoading('payroll-summary');
        try {
          const response = await reportsService.getPayrollSummaryReport();
          console.log('Payroll summary:', response);
          toast.success('Payroll summary generated!');
        } catch (error) {
          toast.error('Failed to generate payroll summary');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'department-payroll',
      title: 'Department Payroll',
      description: 'Payroll breakdown by department',
      icon: Users,
      color: 'bg-green-500',
      action: async () => {
        setLoading('department-payroll');
        try {
          const response = await reportsService.getDepartmentPayrollReport();
          console.log('Department payroll:', response);
          toast.success('Department payroll report generated!');
        } catch (error) {
          toast.error('Failed to generate department payroll report');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'attendance',
      title: 'Attendance Summary',
      description: 'Attendance statistics and trends',
      icon: Calendar,
      color: 'bg-yellow-500',
      action: async () => {
        setLoading('attendance');
        try {
          const response = await reportsService.getAttendanceReport();
          console.log('Attendance report:', response);
          toast.success('Attendance report generated!');
        } catch (error) {
          toast.error('Failed to generate attendance report');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'leave',
      title: 'Leave Summary',
      description: 'Leave usage and patterns',
      icon: FileText,
      color: 'bg-purple-500',
      action: async () => {
        setLoading('leave');
        try {
          const response = await reportsService.getLeaveReport();
          console.log('Leave report:', response);
          toast.success('Leave report generated!');
        } catch (error) {
          toast.error('Failed to generate leave report');
        } finally {
          setLoading(null);
        }
      },
    },
    {
      id: 'employee-cost',
      title: 'Employee Cost Analysis',
      description: 'Cost analysis per employee',
      icon: BarChart3,
      color: 'bg-red-500',
      action: async () => {
        setLoading('employee-cost');
        try {
          const response = await reportsService.getEmployeeCostReport();
          console.log('Employee cost report:', response);
          toast.success('Employee cost report generated!');
        } catch (error) {
          toast.error('Failed to generate employee cost report');
        } finally {
          setLoading(null);
        }
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const Icon = report.icon;
          const isLoading = loading === report.id;
          return (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {report.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${report.color} bg-opacity-10`}>
                    <Icon className={`h-5 w-5 ${report.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{report.description}</p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={report.action}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}