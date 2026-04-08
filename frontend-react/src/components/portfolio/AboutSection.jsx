import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Heart, Target } from 'lucide-react';

export default function AboutSection({ profile }) {
  if (!profile) return null;

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="About Me" subtitle="Get to know me better" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-10"
        >

          {/* BIO */}
          {profile.bio && (
            <div className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition">
              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {profile.interests && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-semibold">Interests</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {profile.interests}
                </p>
              </div>
            )}

            {profile.career_goals && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold">Career Goals</h3>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {profile.career_goals}
                </p>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </section>
  );
}