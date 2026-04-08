import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';

import Navbar from '@/components/portfolio/Navbar';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ExperienceSection from '@/components/portfolio/ExperienceSection';
import EducationSection from '@/components/portfolio/EducationSection';
import CertificatesSection from '@/components/portfolio/CertificatesSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import FadeUpSection from '@/components/portfolio/FadeUpSection';

export default function Home() {

  // ✅ PROFILE (single)
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
  });

  // ✅ SKILLS
  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await api.get('/skills');
      return res.data;
    },
  });

  // ✅ PROJECTS
  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  // ✅ EXPERIENCES
  const { data: experiences = [] } = useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const res = await api.get('/experiences');
      return res.data;
    },
  });

  // ✅ EDUCATION
  const { data: education = [] } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await api.get('/education');
      return res.data;
    },
  });

  // ✅ CERTIFICATES
  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const res = await api.get('/certificates');
      return res.data;
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      <FadeUpSection>
        <HeroSection profile={profile} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <AboutSection profile={profile} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <SkillsSection skills={skills} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <ProjectsSection projects={projects} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <ExperienceSection experiences={experiences} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <EducationSection education={education} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <CertificatesSection certificates={certificates} />
      </FadeUpSection>

      <FadeUpSection delay={0.2}>
        <ContactSection profile={profile} />
      </FadeUpSection>

      <Footer profile={profile} />
    </div>
  );
}