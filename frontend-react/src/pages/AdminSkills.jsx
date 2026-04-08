import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';

import AdminPageHeader from '@/components/admin/AdminPageHeader';
import CrudTable from '@/components/admin/CrudTable';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

import { Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = {
  name: '',
  category: 'frontend',
  level: 80,
  proficiency: 'intermediate'
};

export default function AdminSkills() {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // ================= GET =================
  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => (await api.get('/skills')).data,
  });

  // ================= OPEN =================
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setFile(null);
    setOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);

    setForm({
      name: item.name,
      category: item.category,
      level: item.level,
      proficiency: item.proficiency || 'intermediate'
    });

    setPreview(
      item.icon
        ? `http://127.0.0.1:8000/storage/${item.icon}`
        : null
    );

    setFile(null);
    setOpen(true);
  };

  // ================= FILE =================
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('level', form.level);
      formData.append('proficiency', form.proficiency);

      if (file) {
        formData.append('icon', file);
      }

      if (editing) {
        await api.post(`/skills/${editing.id}?_method=PUT`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Skill updated');
      } else {
        await api.post('/skills', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Skill created');
      }

      queryClient.invalidateQueries({ queryKey: ['skills'] });

      setOpen(false);
      setFile(null);
      setPreview(null);

    } catch (err) {
      console.error(err);
      toast.error('Failed to save');
    }
  };

  const deleteSkill = async (id) => {
    await api.delete(`/skills/${id}`);
    queryClient.invalidateQueries({ queryKey: ['skills'] });
    toast.success('Deleted');
  };

  // ================= TABLE =================
  const columns = [
    { key: 'name', label: 'Name' },
    {
      key: 'category',
      label: 'Category',
      render: (val) => <Badge variant="secondary">{val}</Badge>
    },
    {
      key: 'level',
      label: 'Level',
      render: (val) => `${val}%`
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Skills"
        subtitle="Manage your technical skills"
        actions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        }
      />

      <CrudTable
        columns={columns}
        data={skills}
        onEdit={openEdit}
        onDelete={(item) => deleteSkill(item.id)}
      />

      {/* ================= MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Edit Skill' : 'Add Skill'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            <div>
              <Label className="mb-2 block">Skill Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* CATEGORY */}
            <div>
              <Label className="mb-2 block">Category *</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* LEVEL */}
            <div>
              <Label className="mb-2 block">Level (1-100) *</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                required
              />
            </div>

            {/* PROFICIENCY */}
            <div>
              <Label className="mb-2 block">Proficiency Level</Label>
              <Select
                value={form.proficiency}
                onValueChange={(val) => setForm({ ...form, proficiency: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 🔥 IMAGE (UPDATED STYLE) */}
            <div>
              <Label className="mb-2 block">Skill Icon/Image</Label>

              <div
                onClick={() => document.getElementById('uploadSkill').click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition hover:border-primary hover:bg-muted/50"
              >
                <Upload className="mx-auto mb-2 w-5 h-5 text-muted-foreground" />

                <p className="text-sm text-muted-foreground">
                  Drag & drop image here or click to upload
                </p>

                <input
                  id="uploadSkill"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* PREVIEW */}
              {preview && (
                <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  className="mt-3 w-40 h-40 object-cover rounded-lg border"
                />
                </div>
              )}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button type="submit">
                {editing ? 'Update' : 'Save'}
              </Button>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}