import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CrudTable from '@/components/admin/CrudTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  company: '',
  role: '',
  duration: '',
  description: ''
};

export default function AdminExperience() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // GET
  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await api.get('/experiences');
      return res.data;
    }
  });

  // CREATE / UPDATE
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing) {
        return api.put(`/experiences/${editing.id}`, data);
      }
      return api.post('/experiences', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      setOpen(false);
      setEditing(null);
      setForm(emptyForm);
      toast.success(editing ? 'Experience updated' : 'Experience created');
    }
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
      toast.success('Experience deleted');
    }
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      company: item.company || '',
      role: item.role || '',
      duration: item.duration || '',
      description: item.description || ''
    });
    setOpen(true);
  };

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const columns = [
    { key: 'role', label: 'Role' },
    { key: 'company', label: 'Company' },
    { key: 'duration', label: 'Duration' }
  ];

  return (
    <div>
      <AdminPageHeader
        title="Experience"
        subtitle="Manage your work experience"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </Button>
        }
      />

      <CrudTable
        columns={columns}
        data={experiences}
        onEdit={openEdit}
        onDelete={(item) => deleteMutation.mutate(item.id)}
      />

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editing ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(form);
            }}
            className="space-y-5"
          >
            {/* COMPANY */}
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input
                placeholder="e.g. Google"
                value={form.company}
                onChange={(e) => set('company', e.target.value)}
                className="bg-background focus-visible:ring-2"
                required
              />
            </div>

            {/* ROLE */}
            <div className="space-y-2">
              <Label>Role *</Label>
              <Input
                placeholder="e.g. Frontend Developer"
                value={form.role}
                onChange={(e) => set('role', e.target.value)}
                className="bg-background focus-visible:ring-2"
                required
              />
            </div>

            {/* DURATION */}
            <div className="space-y-2">
              <Label>Duration *</Label>
              <Input
                placeholder="Jan 2023 - Present"
                value={form.duration}
                onChange={(e) => set('duration', e.target.value)}
                className="bg-background focus-visible:ring-2"
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your work..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className="bg-background focus-visible:ring-2 min-h-[100px]"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}