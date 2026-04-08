import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api'; // ✅ ganti
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Code2, FolderKanban, Briefcase, GraduationCap, Award, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const statCards = [
  { label: 'Skills', key: 'skills', icon: Code2, path: '/AdminSkills', color: 'bg-primary/10 text-primary' },
  { label: 'Projects', key: 'projects', icon: FolderKanban, path: '/AdminProjects', color: 'bg-accent/10 text-accent' },
  { label: 'Experience', key: 'experiences', icon: Briefcase, path: '/AdminExperience', color: 'bg-chart-3/20 text-chart-3' },
  { label: 'Education', key: 'education', icon: GraduationCap, path: '/AdminEducation', color: 'bg-chart-4/20 text-chart-4' },
  { label: 'Certificates', key: 'certificates', icon: Award, path: '/AdminCertificates', color: 'bg-primary/20 text-primary' },
  { label: 'Messages', key: 'messages', icon: MessageSquare, path: '/AdminMessages', color: 'bg-chart-5/20 text-chart-5' },
];

export default function Admin() {

  // ✅ semua pakai axios
  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => (await api.get('/skills')).data,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => (await api.get('/projects')).data,
  });

  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => (await api.get('/experiences')).data,
  });

  const { data: education = [] } = useQuery({
    queryKey: ['education'],
    queryFn: async () => (await api.get('/education')).data,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => (await api.get('/certificates')).data,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => (await api.get('/contact-messages')).data,
  });

  const counts = {
    skills: skills.length,
    projects: projects.length,
    experiences: experiences.length,
    education: education.length,
    certificates: certificates.length,
    messages: messages.length,
  };

  return (
  <div>
    <AdminPageHeader 
      title="Dashboard" 
      subtitle="Welcome to your portfolio admin panel" 
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.key} to={card.path}>
            <Card
              className="
                rounded-2xl 
                border border-slate-200 
                dark:border-slate-800
                shadow-sm 
                hover:shadow-md
                dark:shadow-md dark:hover:shadow-xl
                transition-shadow
                duration-200 
                hover:-translate-y-1
                cursor-pointer
              "
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">

                  {/* ICON */}
                  <div
                    className={`
                      w-12 h-12 rounded-xl 
                      flex items-center justify-center 
                      ${card.color} 
                      bg-opacity-20 
                      shadow-lg
                    `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* TEXT */}
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      {card.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {counts[card.key]}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  </div>
);
}