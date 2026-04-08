import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { GraduationCap } from 'lucide-react';

export default function EducationSection({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-24 px-6">
      {/* ✅ LEBIH LEBAR */}
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          title="Education"
          subtitle="My academic background"
        />

        {/* ✅ GRID LEBIH BALANCE */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }} // 🔥 lebih kerasa dikit
              whileTap={{ scale: 0.97 }} // 🔥 efek klik
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}

              className="
                bg-card
                border border-border
                rounded-2xl
                p-6

                // ✅ BASE DEPTH
                shadow-sm

                // ✅ INTERACTION LEBIH HIDUP
                transition-all duration-300 ease-out
                hover:shadow-xl
                hover:-translate-y-1
                active:scale-[0.98]
              "
            >
              <div className="flex items-start gap-4">
                
                {/* ICON */}
                <div className="
                  w-12 h-12
                  rounded-xl
                  bg-primary/10
                  flex items-center justify-center
                ">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold leading-tight">
                    {edu.degree}
                  </h3>

                  <p className="text-primary font-medium mt-1">
                    {edu.institution}
                  </p>

                  <p className="text-sm text-muted-foreground mt-1">
                    {edu.year}
                  </p>

                  {edu.description && (
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}