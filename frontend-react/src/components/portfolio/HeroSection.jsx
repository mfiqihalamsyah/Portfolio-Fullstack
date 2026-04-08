import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Download,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const BASE_URL = 'http://127.0.0.1:8000/storage/';

export default function HeroSection({ profile }) {
  if (!profile) {
    return (
      <section id="hero" className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-32 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-1/2 bg-muted rounded" />
            <div className="h-6 w-1/3 bg-muted rounded" />
            <div className="h-6 w-1/4 bg-muted rounded" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden">

      {/* background blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32 w-full relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {profile.tagline && (
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm rounded-full mb-6">
                {profile.tagline}
              </span>
            )}

            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Hi, I'm <br />
              <span className="text-primary">{profile.name}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-3">
              {profile.title}
            </p>

            {profile.location && (
              <p className="flex items-center gap-2 text-muted-foreground mb-8">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </p>
            )}

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-3 mb-8">
              {profile.github && (
                <a href={profile.github} target="_blank">
                  <Button variant="outline"><Github className="w-4 h-4 mr-2" />GitHub</Button>
                </a>
              )}
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank">
                  <Button variant="outline"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</Button>
                </a>
              )}
              {profile.instagram && (
                <a href={profile.instagram} target="_blank">
                  <Button variant="outline"><Instagram className="w-4 h-4 mr-2" />Instagram</Button>
                </a>
              )}
              {profile.youtube && (
                <a href={profile.youtube} target="_blank">
                  <Button variant="outline"><Youtube className="w-4 h-4 mr-2" />YouTube</Button>
                </a>
              )}
              {profile.twitter && (
                <a href={profile.twitter} target="_blank">
                  <Button variant="outline"><Twitter className="w-4 h-4 mr-2" />Twitter</Button>
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`}>
                  <Button variant="outline"><Mail className="w-4 h-4 mr-2" />Email</Button>
                </a>
              )}
              {profile.resume && (
                <a href={BASE_URL + profile.resume} target="_blank">
                  <Button><Download className="w-4 h-4 mr-2" />Resume</Button>
                </a>
              )}
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            {profile.photo ? (
              <div className="relative group">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-2 ring-primary/10">
                  <img
                    src={BASE_URL + profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-3xl bg-gray-200 flex items-center justify-center">
                <span className="text-6xl text-gray-400">
                  {profile.name?.[0] || '?'}
                </span>
              </div>
            )}
          </motion.div>

        </div>

        {/* SCROLL */}
        <div className="flex justify-center mt-16">
          <button onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}>
            <ArrowDown className="w-6 h-6 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}