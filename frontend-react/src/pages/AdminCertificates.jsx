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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = 'http://127.0.0.1:8000';

const emptyForm = {
  title: '',
  issuer: '',
  date: '',
  credential_id: '',
  credential_url: '',
  description: '',
  image: null,
};

export default function AdminCertificates() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // ================= GET =================
  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => (await api.get('/certificates')).data,
  });

  // ================= FILE =================
  const handleFile = (file) => {
    if (!file) return;

    setForm((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  // ================= SAVE =================
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('issuer', data.issuer);
      formData.append('date', data.date);
      formData.append('credential_id', data.credential_id || '');
      formData.append('credential_url', data.credential_url || '');
      formData.append('description', data.description || '');

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (editing) {
        return api.post(`/certificates/${editing.id}?_method=PUT`, formData);
      }

      return api.post('/certificates', formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setOpen(false);
      setPreview(null);
      toast.success(editing ? 'Certificate updated' : 'Certificate created');
    },

    onError: (err) => {
      console.error(err);
      toast.error('Failed to save certificate');
    },
  });

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/certificates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Deleted');
      setDeleting(null);
    },
  });

  // ================= HANDLER =================
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);

    setForm({
      title: item.title || '',
      issuer: item.issuer || '',
      date: item.date || '',
      credential_id: item.credential_id || '',
      credential_url: item.credential_url || '',
      description: item.description || '',
      image: null,
    });

    setPreview(item.image ? BASE_URL + item.image : null);
    setOpen(true);
  };

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ================= TABLE =================
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'date', label: 'Date' },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Certificates"
        subtitle="Manage your professional certifications"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Certificate
          </Button>
        }
      />

      <CrudTable
        columns={columns}
        data={certificates}
        onEdit={openEdit}
        onDelete={(item) => setDeleting(item)}
      />

      {/* ================= MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Certificate' : 'Add Certificate'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveMutation.mutate(form);
            }}
            className="space-y-5"
          >
            {/* TITLE */}
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setField('title', e.target.value)}
                required
              />
            </div>

            {/* ISSUER */}
            <div className="space-y-2">
              <Label>Issuer *</Label>
              <Input
                value={form.issuer}
                onChange={(e) => setField('issuer', e.target.value)}
                required
              />
            </div>

            {/* DATE */}
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input
                placeholder="e.g. January 2025"
                value={form.date}
                onChange={(e) => setField('date', e.target.value)}
                required
              />
            </div>

            {/* ID */}
            <div className="space-y-2">
              <Label>Credential ID</Label>
              <Input
                value={form.credential_id}
                onChange={(e) => setField('credential_id', e.target.value)}
              />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label>Credential URL</Label>
              <Input
                placeholder="Google Drive URL"
                value={form.credential_url}
                onChange={(e) =>
                  setField('credential_url', e.target.value)
                }
              />
            </div>

            {/* DESC */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>

            {/* 🔥 IMAGE (SAMA KAYAK PROJECT) */}
            <div className="space-y-2">
              <Label>Certificate Image</Label>

              <div
                onClick={() =>
                  document.getElementById('cert-upload').click()
                }
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:border-primary hover:bg-muted/50"
              >
                <Upload className="mx-auto mb-2 w-6 h-6 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  Drag & drop image here or click to upload
                </p>

                <input
                  id="cert-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* PREVIEW */}
              {(form.image || preview) && (
                <img
                  src={
                    form.image
                      ? URL.createObjectURL(form.image)
                      : preview
                  }
                  className="w-full aspect-video object-cover rounded-lg border"
                />
              )}
            </div>

            {/* ACTION */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending
                  ? 'Saving...'
                  : editing
                  ? 'Update'
                  : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Delete "{deleting?.title}"?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(deleting.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}