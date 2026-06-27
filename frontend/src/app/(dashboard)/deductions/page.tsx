'use client';
import { useState } from 'react';
import { useDeductions, useCreateDeduction } from '@/hooks/useApi';
import { Badge, Button, Input, Select, Modal, LoadingSpinner, EmptyState } from '@/src/components/ui';
import { Plus, Minus } from 'lucide-react';

const defaultForm = { name: '', code: '', type: 'statutory', calculationType: 'fixed', value: '', description: '' };

export default function DeductionsPage() {
  const { data: deductions, isLoading } = useDeductions();
  const createMutation = useCreateDeduction();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!form.name || !form.code || !form.value) { setError('Name, code and value are required'); return; }
    try {
      await createMutation.mutateAsync({ ...form, code: form.code.toUpperCase(), value: parseFloat(form.value) });
      setShowModal(false); setForm(defaultForm);
    } catch (err: any) { setError(err.response?.data?.message || 'Failed'); }
  };

  const typeColors: Record<string, string> = {
    statutory: 'bg-red-50 border-red-200', voluntary: 'bg-blue-50 border-blue-200',
    loan: 'bg-yellow-50 border-yellow-200', penalty: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <Button onClick={() => { setError(''); setForm(defaultForm); setShowModal(true); }} icon={<Plus className="w-4 h-4" />}>Add Deduction</Button>
      </div>

      {isLoading ? <LoadingSpinner /> : !deductions?.length ? (
        <div className="bg-white rounded-2xl p-8">
          <EmptyState title="No deduction types" description="Create deduction types like tax, pension, etc." icon={<Minus className="w-12 h-12" />} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {deductions.map((d: any) => (
            <div key={d._id} className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow ${typeColors[d.type] || 'border-gray-100'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-800">{d.name}</p>
                  <span className="text-xs font-mono text-gray-500">{d.code}</span>
                </div>
                <Badge status={d.type} />
              </div>
              {d.description && <p className="text-sm text-gray-500 mb-3">{d.description}</p>}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-sm text-gray-500 capitalize">{d.calculationType}</span>
                <span className="font-bold text-gray-800">
                  {d.calculationType === 'percentage' ? `${d.value}%` : `₦${d.value.toLocaleString()}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Deduction Type">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
        <div className="space-y-4">
          <Input label="Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Income Tax" />
          <Input label="Code *" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="TAX" />
          <Select label="Type *" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
            options={[{ value: 'statutory', label: 'Statutory' }, { value: 'voluntary', label: 'Voluntary' }, { value: 'loan', label: 'Loan' }, { value: 'penalty', label: 'Penalty' }]} />
          <Select label="Calculation Type" value={form.calculationType} onChange={e => setForm({ ...form, calculationType: e.target.value })}
            options={[{ value: 'fixed', label: 'Fixed Amount (₦)' }, { value: 'percentage', label: 'Percentage (%)' }]} />
          <Input label={`Value (${form.calculationType === 'percentage' ? '%' : '₦'}) *`} type="number" value={form.value}
            onChange={e => setForm({ ...form, value: e.target.value })} placeholder={form.calculationType === 'percentage' ? '7.5' : '5000'} />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-gray-800" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={handleCreate} loading={createMutation.isPending}>Create Deduction</Button>
        </div>
      </Modal>
    </div>
  );
}
