'use client';
import { useState } from 'react';
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from '@/hooks/useApi';
import { Button, Input, Modal, LoadingSpinner, EmptyState, formatCurrency } from '@/src/components/ui';
import { Plus, Edit2, Trash2, Building2, Users } from 'lucide-react';

const defaultForm = { name: '', code: '', description: '', budget: '', location: '' };

export default function DepartmentsPage() {
  const { data: departments, isLoading } = useDepartments();
  const createMutation = useCreateDepartment();
  const updateMutation = useUpdateDepartment();
  const deleteMutation = useDeleteDepartment();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(''); setShowModal(true); };
  const openEdit = (d: any) => {
    setEditing(d);
    setForm({ name: d.name, code: d.code, description: d.description || '', budget: String(d.budget), location: d.location || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.code) { setError('Name and code are required'); return; }
    try {
      const payload = { ...form, code: form.code.toUpperCase(), budget: parseFloat(form.budget) || 0 };
      if (editing) { await updateMutation.mutateAsync({ id: editing._id, data: payload }); }
      else { await createMutation.mutateAsync(payload); }
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Deactivate department "${name}"?`)) return;
    try { await deleteMutation.mutateAsync(id); }
    catch (err: any) { alert(err.response?.data?.message || 'Failed'); }
  };

  const depts = departments || [];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={openCreate} icon={<Plus className="w-4 h-4" />}>Add Department</Button>
      </div>

      {isLoading ? <LoadingSpinner /> : depts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8">
          <EmptyState title="No departments yet" description="Create your first department" icon={<Building2 className="w-12 h-12" />} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {depts.map((d: any) => (
            <div key={d._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{d.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">{d.code}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(d._id, d.name)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {d.description && <p className="text-sm text-gray-500 mb-4 leading-relaxed">{d.description}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1"><Users className="w-4 h-4" /><span className="text-xl font-bold">{d.employeeCount || 0}</span></div>
                  <p className="text-xs text-gray-500">Employees</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl text-center">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(d.budget || 0)}</p>
                  <p className="text-xs text-gray-500">Budget</p>
                </div>
              </div>
              {d.location && <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">📍 {d.location}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Department' : 'Add Department'}>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        <div className="space-y-4">
          <Input label="Department Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Engineering" />
          <Input label="Code *" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="ENG" />
          <Input label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Software development team" />
          <Input label="Budget (₦)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="5000000" />
          <Input label="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Lagos, Nigeria" />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} loading={createMutation.isPending || updateMutation.isPending}>
            {editing ? 'Update' : 'Create Department'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
