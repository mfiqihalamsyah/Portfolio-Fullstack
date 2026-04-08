import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

const BASE_URL = 'http://127.0.0.1:8000/storage/';

export default function AdminProfile() {
  const queryClient = useQueryClient();

  const [preview, setPreview] = useState({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data?.data ?? res.data;
    },
  });

  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    photo: '',
    location: '',
    email: '',
    linkedin: '',
    github: '',
    instagram: '',
    youtube: '',
    twitter: '',
    resume: '',
    tagline: '',
    interests: '',
    career_goals: '',
  });

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  // 🔥 HANDLE FILE
  const handleFileUpload = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = null;

    setForm(prev => ({
      ...prev,
      [field]: file,
    }));

    if (field === 'photo') {
      setPreview(prev => ({
        ...prev,
        photo: URL.createObjectURL(file),
      }));
    }
  };

  // 🔥 SUBMIT FIX (IMPORTANT)
  const mutation = useMutation({
    mutationFn: (form) => {
      const formData = new FormData();

      Object.keys(form).forEach(key => {
        const value = form[key];

        if (key === 'photo' || key === 'resume') {
          if (value instanceof File) {
            formData.append(key, value);
          }
        } else {
          if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        }
      });

      return api.post('/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setPreview({});
      toast.success('Profile saved');
    },
    onError: () => {
      toast.error('Failed to save');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div>
      <AdminPageHeader title="Profile" subtitle="Manage your personal information" />

      <form onSubmit={handleSubmit}>
        <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
          <CardContent className="p-6 space-y-8">

            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                <Field label="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                <Field label="Tagline" value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
                <Field label="Email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                <Field label="GitHub URL" value={form.github} onChange={(e) => set('github', e.target.value)} />
                <Field label="YouTube URL" value={form.youtube} onChange={(e) => set('youtube', e.target.value)} />

                <UploadField
                  label="Photo"
                  value={form.photo}
                  preview={preview.photo}
                  onUpload={(e) => handleFileUpload(e, 'photo')}
                />
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field label="Professional Title" value={form.title} onChange={(e) => set('title', e.target.value)} />
                <Field label="Location" value={form.location} onChange={(e) => set('location', e.target.value)} />
                <Field label="LinkedIn URL" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
                <Field label="Instagram URL" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
                <Field label="Twitter/X URL" value={form.twitter} onChange={(e) => set('twitter', e.target.value)} />

                <UploadField
                  label="Resume"
                  value={form.resume}
                  onUpload={(e) => handleFileUpload(e, 'resume')}
                />
              </div>

            </div>

            <TextareaField label="Biography" value={form.bio} onChange={(e) => set('bio', e.target.value)} />

            <div className="grid md:grid-cols-2 gap-6">
              <TextareaField label="Interests" value={form.interests} onChange={(e) => set('interests', e.target.value)} />
              <TextareaField label="Career Goals" value={form.career_goals} onChange={(e) => set('career_goals', e.target.value)} />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={mutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </div>
  );
}

/* 🔥 HELPERS */

const getFileType = (file) => {
  const name = typeof file === 'string' ? file : file?.name;

  if (!name) return null;

  if (name.match(/\.(jpg|jpeg|png|webp)$/i)) return 'image';
  if (name.match(/\.pdf$/i)) return 'pdf';
  if (name.match(/\.(doc|docx)$/i)) return 'word';
  if (name.match(/\.(ppt|pptx)$/i)) return 'ppt';
  if (name.match(/\.(xls|xlsx)$/i)) return 'excel';

  return 'file';
};

/* 🔥 COMPONENTS */

const Field = ({ label, ...props }) => (
  <div>
    <Label className="mb-2 block">{label}</Label>
    <Input {...props} />
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div>
    <Label className="mb-2 block">{label}</Label>
    <Textarea className="min-h-[120px]" {...props} />
  </div>
);

const UploadField = ({ label, value, preview, onUpload }) => {
  const type = getFileType(value);

  return (
    <div className="space-y-2 min-h-[140px] flex flex-col justify-between">
      <Label className="block">{label}</Label>

      {/* CONTENT AREA (biar tinggi sama) */}
      <div className="flex items-center gap-3 min-h-[80px]">
        
        {/* IMAGE */}
        {(preview || (typeof value === 'string' && type === 'image')) && (
          <img
            src={preview || BASE_URL + value}
            className="w-16 h-16 object-cover rounded-md border"
          />
        )}

        {/* FILE */}
        {typeof value === 'string' && value && type !== 'image' && (
          <div className="text-sm text-blue-500 flex items-center gap-2">
            <span>
              {type === 'pdf' && '📄'}
              {type === 'word' && '📝'}
              {type === 'ppt' && '📊'}
              {type === 'excel' && '📈'}
              {type === 'file' && '📁'}
            </span>
            <a href={BASE_URL + value} target="_blank">
              View file
            </a>
          </div>
        )}
      </div>

      {/* BUTTON (SAMA SEMUA) */}
      <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-800 transition">
        <input type="file" className="hidden" onChange={onUpload} />
        <Upload className="w-4 h-4" />
        <span className="text-sm">Upload</span>
      </label>
    </div>
  );
};