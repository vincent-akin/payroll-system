'use client';
import { useUsers, useUpdateUserRole, useToggleUserActive } from '@/hooks/useApi';
import { Badge, LoadingSpinner, Table, EmptyState, formatCurrency } from '@/src/components/ui';
import { UserCog, Shield, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '@/store/authStore';

export default function UsersPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading } = useUsers();
  const roleMutation = useUpdateUserRole();
  const toggleMutation = useToggleUserActive();

  const handleRoleChange = async (id: string, role: string) => {
    await roleMutation.mutateAsync({ id, role });
  };

  const handleToggle = async (id: string, name: string, isActive: boolean) => {
    if (!confirm(`${isActive ? 'Deactivate' : 'Activate'} user "${name}"?`)) return;
    await toggleMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? <LoadingSpinner /> : !users?.length ? (
          <EmptyState title="No users found" icon={<UserCog className="w-12 h-12" />} />
        ) : (
          <Table headers={['User', 'Role', 'Status', 'Last Login', 'Created', 'Actions']}>
            {users.map((u: any) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  {currentUser?._id !== u._id ? (
                    <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700">
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="user">User</option>
                    </select>
                  ) : <Badge status={u.role} />}
                </td>
                <td className="py-3 px-4"><Badge status={u.isActive ? 'active' : 'inactive'} /></td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {u.lastLogin ? format(new Date(u.lastLogin), 'MMM dd, HH:mm') : 'Never'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">{format(new Date(u.createdAt), 'MMM dd, yyyy')}</td>
                <td className="py-3 px-4">
                  {currentUser?._id !== u._id && (
                    <button onClick={() => handleToggle(u._id, u.name, u.isActive)}
                      className={`p-1.5 rounded-lg transition ${u.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={u.isActive ? 'Deactivate' : 'Activate'}>
                      {u.isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </div>
    </div>
  );
}
