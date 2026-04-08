import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SectionHeading from './SectionHeading';

const BASE_URL = "http://127.0.0.1:8000";

export default function CertificatesSection({ certificates }) {
  if (!certificates || certificates.length === 0) return null;

  return (
    <section id="certificates" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Certificates"
          subtitle="Professional certifications and achievements"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              {/* 🔥 FLEX COLUMN */}
              <Card className="h-full flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

                {/* IMAGE (TIDAK DIUBAH) */}
                {cert.image && (
                  <div className="w-full bg-muted flex items-center justify-center overflow-hidden">
                    <img
                      src={`${BASE_URL}${cert.image}`}
                      alt={cert.title}
                      className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  </div>
                )}

                {/* 🔥 INI KUNCINYA */}
                <CardContent className="p-6 space-y-4 mt-auto">

                  {/* HEADER */}
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-3 rounded-xl shadow-sm">
                      <Award className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-serif text-xl font-semibold text-foreground">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <Badge variant="secondary">
                      {cert.date}
                    </Badge>
                  </div>

                  {/* DESCRIPTION (BIAR GA COLAPSE) */}
                  <p className="text-sm text-muted-foreground border-l-2 border-primary/20 pl-3">
                    {cert.description || ' '}
                  </p>

                  {/* FOOTER */}
                  <div className="pt-3 space-y-2 border-t border-border">

                    {cert.credential_id && (
                      <div className="flex gap-2 text-xs">
                        <span className="text-muted-foreground font-semibold">ID:</span>
                        <span className="font-mono">{cert.credential_id}</span>
                      </div>
                    )}

                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition group"
                      >
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                        View Certificate
                      </a>
                    )}

                  </div>

                </CardContent>

              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}