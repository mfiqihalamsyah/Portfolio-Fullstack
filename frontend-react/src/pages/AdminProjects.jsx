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

import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = 'http://127.0.0.1:8000/storage/';

const emptyForm = {
  title: '',
  description: '',
  image: null,
  technologies: '',
  project_url: '',
  github_url: '',
};

export default function AdminProjects() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);

  // ================= GET =================
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  // ================= CROP 16:9 =================
  const cropTo16by9 = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const targetRatio = 16 / 9;

        let width = img.width;
        let height = img.height;

        let newWidth, newHeight;

        if (width / height > targetRatio) {
          newHeight = height;
          newWidth = height * targetRatio;
        } else {
          newWidth = width;
          newHeight = width / targetRatio;
        }

        const offsetX = (width - newWidth) / 2;
        const offsetY = (height - newHeight) / 2;

        canvas.width = 1280;
        canvas.height = 720;

        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          newWidth,
          newHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );

        canvas.toBlob((blob) => {
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
          });
          resolve(newFile);
        }, 'image/jpeg', 0.9);
      };

      reader.readAsDataURL(file);
    });
  };

  // ================= FILE HANDLER =================
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const cropped = await cropTo16by9(file);

    setForm((prev) => ({ ...prev, image: cropped }));
    setPreview(URL.createObjectURL(cropped));
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const cropped = await cropTo16by9(file);

    setForm((prev) => ({ ...prev, image: cropped }));
    setPreview(URL.createObjectURL(cropped));
  };

  // ================= SAVE =================
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const formData = new FormData();

      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('technologies', data.technologies);
      formData.append('project_url', data.project_url);
      formData.append('github_url', data.github_url);

      if (data.image instanceof File) {
        formData.append('image', data.image);
      }

      if (editing) {
        return api.post(`/projects/${editing.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      return api.post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setOpen(false);
      setPreview(null);
      toast.success(editing ? 'Project updated' : 'Project created');
    },
  });

  // ================= DELETE =================
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
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
      description: item.description || '',
      image: null,
      technologies: item.technologies || '',
      project_url: item.project_url || '',
      github_url: item.github_url || '',
    });

    setPreview(item.image ? BASE_URL + item.image : null);
    setOpen(true);
  };

  const set = (key, val) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ================= TABLE =================
  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'technologies',
      label: 'Technologies',
      render: (val) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {val}
        </span>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        subtitle="Manage your portfolio projects"
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        }
      />

      <CrudTable
        columns={columns}
        data={projects}
        onEdit={openEdit}
        onDelete={(item) => deleteMutation.mutate(item.id)}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Project' : 'Add Project'}
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
                onChange={(e) => set('title', e.target.value)}
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                required
                className="min-h-[120px]"
              />
            </div>

            {/* TECHNOLOGIES */}
            <div className="space-y-2">
              <Label>Technologies (comma-separated)</Label>
              <Input
                placeholder="React, Node.js, PostgreSQL"
                value={form.technologies}
                onChange={(e) => set('technologies', e.target.value)}
              />
            </div>

            {/* 🔥 FIXED UPLOAD AREA */}
            <div className="space-y-2">
              <Label>Image</Label>

              <div
                onClick={() =>
                  document.getElementById('uploadInput').click()
                }
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:border-primary hover:bg-muted/50"
              >
                <Upload className="mx-auto mb-2" />

                <p className="text-sm text-muted-foreground">
                  Drag & drop image here or click to upload
                </p>

                <input
                  id="uploadInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>

              {/* PREVIEW */}
              {preview && (
                <img
                  src={preview}
                  className="w-full aspect-video object-cover rounded-lg border"
                />
              )}
            </div>

            {/* URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input
                  value={form.project_url}
                  onChange={(e) =>
                    set('project_url', e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={form.github_url}
                  onChange={(e) =>
                    set('github_url', e.target.value)
                  }
                />
              </div>
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
                  : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}