import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Briefcase } from 'lucide-react';

export default function ExperienceSection({ experiences }) {
  if (!experiences || experiences.length === 0) return null;

  return (
    <section id="experience" className="py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey"
        />

        <div className="relative mt-16">
          {/* TIMELINE LINE */}
          <div className="absolute left-[28px] top-0 bottom-0 w-[2px] bg-border hidden md:block" />

          <div className="space-y-10">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative md:pl-20"
              >
                {/* DOT */}
                <div className="absolute left-[20px] top-6 hidden md:flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                </div>

                {/* CARD */}
                <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    {/* ICON MOBILE */}
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex md:hidden items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1">
                      {/* ROLE */}
                      <h3 className="text-xl font-semibold tracking-tight">
                        {exp.role}
                      </h3>

                      {/* COMPANY */}
                      <p className="text-primary font-medium mt-1">
                        {exp.company}
                      </p>

                      {/* DURATION */}
                      <p className="text-sm text-muted-foreground mt-1">
                        {exp.duration}
                      </p>

                      {/* DESCRIPTION */}
                      {exp.description && (
                        <p className="text-muted-foreground mt-4 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}