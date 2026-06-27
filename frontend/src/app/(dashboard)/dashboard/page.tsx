// src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { employeeService } from '@/lib/api/employee';
import { attendanceService } from '@/lib/api/attendance';
import { leaveService } from '@/lib/api/leave';
import { payrollService } from '@/lib/api/payroll';
import { AttendanceModal } from '@/components/modals/AttendanceModal';
import { LeaveModal } from '@/components/modals/LeaveModal';
import { PayrollModal } from '@/components/modals/PayrollModal';
import { EmployeeModal } from '@/components/modals/EmployeeModal';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  pendingApprovals: number;
  totalPayroll: number;
  averageSalary: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingApprovals: 0,
    totalPayroll: 0,
    averageSalary: 0,
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState({
    attendance: false,
    leave: false,
    payroll: false,
    employee: false,
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real employees
      const employeesRes = await employeeService.getEmployees();
      const employees = employeesRes.success && employeesRes.data 
        ? (Array.isArray(employeesRes.data) ? employeesRes.data : employeesRes.data.data || []) 
        : [];
      
      // Fetch real attendance
      const attendanceRes = await attendanceService.getAttendances();
      const attendances = attendanceRes.success && attendanceRes.data 
        ? (Array.isArray(attendanceRes.data) ? attendanceRes.data : attendanceRes.data.data || []) 
        : [];
      
      // Fetch real leaves
      const leavesRes = await leaveService.getLeaves();
      const leaves = leavesRes.success && leavesRes.data 
        ? (Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.data || []) 
        : [];
      
      // Fetch real payrolls
      const payrollsRes = await payrollService.getPayrolls();
      const payrolls = payrollsRes.success && payrollsRes.data 
        ? (Array.isArray(payrollsRes.data) ? payrollsRes.data : payrollsRes.data.data || []) 
        : [];

      // Calculate real stats
      const today = new Date().toISOString().split('T')[0];
      const presentToday = attendances.filter((a: any) => {
        const date = a.attendanceDate?.toString().split('T')[0];
        return date === today && a.status === 'PRESENT';
      }).length;
      
      const onLeave = attendances.filter((a: any) => {
        const date = a.attendanceDate?.toString().split('T')[0];
        return date === today && a.status === 'LEAVE';
      }).length;
      
      const pendingApprovals = leaves.filter((l: any) => l.status === 'PENDING').length;
      
      const totalPayroll = payrolls.reduce((sum: number, p: any) => sum + (p.totalNetSalary || 0), 0);
      const avgSalary = employees.length > 0 ? totalPayroll / employees.length : 0;

      setStats({
        totalEmployees: employees.length,
        presentToday,
        onLeave,
        pendingApprovals,
        totalPayroll,
        averageSalary: avgSalary,
      });

      // Build real activities from data
      const newActivities: Activity[] = [];

      // Add leave activities with safe access
      leaves.slice(0, 3).forEach((leave: any) => {
        const firstName = leave.employee?.user?.firstName || 'Unknown';
        const lastName = leave.employee?.user?.lastName || '';
        const name = `${firstName} ${lastName}`.trim();
        const status = leave.status || 'PENDING';
        const action = status === 'PENDING' ? 'Requested leave' : 
                       status === 'APPROVED' ? 'Leave approved' : 
                       status === 'REJECTED' ? 'Leave rejected' : 'Leave ' + status.toLowerCase();
        const time = leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() + ' ' + 
              new Date(leave.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
        
        newActivities.push({
          id: leave._id || Math.random().toString(),
          user: name || 'Unknown User',
          action: action,
          time: time
        });
      });

      // Add attendance activities with safe access
      attendances.slice(0, 2).forEach((att: any) => {
        const firstName = att.employee?.user?.firstName || 'Unknown';
        const lastName = att.employee?.user?.lastName || '';
        const name = `${firstName} ${lastName}`.trim();
        const status = att.status || 'UNKNOWN';
        const action = `Marked ${status.toLowerCase()}`;
        const time = att.createdAt ? new Date(att.createdAt).toLocaleDateString() + ' ' + 
              new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
        
        newActivities.push({
          id: att._id || Math.random().toString(),
          user: name || 'Unknown User',
          action: action,
          time: time
        });
      });

      // Add payroll activities with safe access
      payrolls.slice(0, 2).forEach((pay: any) => {
        const status = pay.status || 'PROCESSED';
        const action = `Payroll ${status.toLowerCase()}`;
        const time = pay.createdAt ? new Date(pay.createdAt).toLocaleDateString() + ' ' + 
              new Date(pay.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
        
        newActivities.push({
          id: pay._id || Math.random().toString(),
          user: 'System',
          action: action,
          time: time
        });
      });

      // Sort by time (most recent first) and take top 5
      const sortedActivities = newActivities.sort((a, b) => {
        // Simple string comparison for time
        return b.time.localeCompare(a.time);
      }).slice(0, 5);
      
      setActivities(sortedActivities);
      
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openModal = (modal: keyof typeof modalOpen) => {
    setModalOpen({ ...modalOpen, [modal]: true });
  };

  const closeModal = (modal: keyof typeof modalOpen) => {
    setModalOpen({ ...modalOpen, [modal]: false });
  };

  const handleSuccess = () => {
    fetchDashboardData();
    toast.success('Action completed successfully!');
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Present Today',
      value: stats.presentToday,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'On Leave',
      value: stats.onLeave,
      icon: Calendar,
      color: 'bg-yellow-500',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-red-500',
    },
    {
      title: 'Total Payroll (This Month)',
      value: `$${stats.totalPayroll.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Average Salary',
      value: `$${stats.averageSalary.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-indigo-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{activity.user || 'Unknown'}</p>
                      <p className="text-sm text-gray-500">{activity.action || 'Activity'}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time || 'Recently'}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => openModal('attendance')}
              >
                <UserCheck className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-medium">Mark Attendance</p>
              </button>
              <button
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => openModal('leave')}
              >
                <Calendar className="h-6 w-6 text-green-600 mb-2" />
                <p className="font-medium">Request Leave</p>
              </button>
              <button
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => openModal('payroll')}
              >
                <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium">Run Payroll</p>
              </button>
              <button
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => openModal('employee')}
              >
                <Users className="h-6 w-6 text-orange-600 mb-2" />
                <p className="font-medium">Add Employee</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AttendanceModal
        isOpen={modalOpen.attendance}
        onClose={() => closeModal('attendance')}
        onSuccess={handleSuccess}
      />
      <LeaveModal
        isOpen={modalOpen.leave}
        onClose={() => closeModal('leave')}
        onSuccess={handleSuccess}
      />
      <PayrollModal
        isOpen={modalOpen.payroll}
        onClose={() => closeModal('payroll')}
        onSuccess={handleSuccess}
      />
      <EmployeeModal
        isOpen={modalOpen.employee}
        onClose={() => closeModal('employee')}
        onSuccess={handleSuccess}
      />
    </div>
  );
}