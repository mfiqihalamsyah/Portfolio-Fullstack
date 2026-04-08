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
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  institution: '',
  degree: '',
  year: '',
  description: '',
};

export default function AdminEducation() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // GET
  const { data: education = [] } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await api.get('/education');
      return res.data;
    },
  });

  // CREATE / UPDATE
  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editing) {
        return api.put(`/education/${editing.id}`, data);
      }
      return api.post('/education', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      setOpen(false);
      setForm(emptyForm);
      setEditing(null);
      toast.success(editing ? 'Education updated' : 'Education created');
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/education/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['education'] });
      toast.success('Education deleted');
    },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      institution: item.institution || '',
      degree: item.degree || '',
      year: item.year || '',
      description: item.description || '',
    });
    setOpen(true);
  };

  const set = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const columns = [
    { key: 'degree', label: 'Degree' },
    { key: 'institution', label: 'Institution' },
    { key: 'year', label: 'Year' },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Education"
        subtitle="Manage your educational background"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Add Education
          </Button>
        }
      />

      <CrudTable
        columns={columns}
        data={education}
        onEdit={openEdit}
        onDelete={(item) => deleteMutation.mutate(item.id)}
      />

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              {editing ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(form);
            }}
            className="space-y-5"
          >
            {/* Institution */}
            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input
                className="focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 border focus:border-primary"
                value={form.institution}
                onChange={(e) => set('institution', e.target.value)}
                required
              />
            </div>

            {/* Degree */}
            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input
                className="focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 border focus:border-primary"
                value={form.degree}
                onChange={(e) => set('degree', e.target.value)}
                required
              />
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label>Year *</Label>
              <Input
                placeholder="e.g. 2020 - 2023"
                className="focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 border focus:border-primary"
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                className="focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 border focus:border-primary min-h-[100px]"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            {/* Actions */}
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