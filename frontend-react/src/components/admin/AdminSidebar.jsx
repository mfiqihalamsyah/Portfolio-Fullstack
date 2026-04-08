import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Code2, FolderKanban, Briefcase, GraduationCap, Award, MessageSquare, LayoutDashboard, LogOut, ArrowLeft } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { label: 'Dashboard', path: '/Admin', icon: LayoutDashboard },
  { label: 'Profile', path: '/AdminProfile', icon: User },
  { label: 'Skills', path: '/AdminSkills', icon: Code2 },
  { label: 'Projects', path: '/AdminProjects', icon: FolderKanban },
  { label: 'Experience', path: '/AdminExperience', icon: Briefcase },
  { label: 'Education', path: '/AdminEducation', icon: GraduationCap },
  { label: 'Certificates', path: '/AdminCertificates', icon: Award },
  { label: 'Messages', path: '/AdminMessages', icon: MessageSquare },
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-lg font-bold font-serif text-sidebar-primary">Admin Panel</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <div className="flex items-center justify-between px-4 py-3 text-sidebar-foreground/70">
          <span className="text-xs font-medium uppercase tracking-wider">Theme</span>
          <ThemeToggle variant="ghost" />
        </div>
        <Link
          to="/Home"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          View Portfolio
        </Link>
        <button
          onClick={() => base44.auth.logout()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}