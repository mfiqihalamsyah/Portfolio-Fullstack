import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Code2 } from 'lucide-react';
import SectionHeading from './SectionHeading';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const BASE_URL = "http://127.0.0.1:8000/storage";

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  tools: 'Tools',
  design: 'Design',
  other: 'Other',
};

const categoryColors = {
  frontend: 'bg-primary/10 text-primary',
  backend: 'bg-accent/10 text-accent',
  tools: 'bg-chart-3/20 text-chart-3',
  design: 'bg-chart-4/20 text-chart-4',
  other: 'bg-muted text-muted-foreground',
};

const proficiencyLabels = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  expert: 'Expert',
};

const proficiencyColors = {
  beginner: 'bg-chart-4/20 text-chart-4',
  intermediate: 'bg-chart-3/20 text-chart-3',
  advanced: 'bg-accent/10 text-accent',
  expert: 'bg-primary/10 text-primary',
};

/* ========================= */
/* 🔥 CAROUSEL */
/* ========================= */
function SkillCarousel({ items, category, idx }) {
  const trackRef = useRef(null);

  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const isPausedRef = useRef(false);
  const isDragging = useRef(false);

  const startX = useRef(0);
  const startOffset = useRef(0);

  const loopItems = [...items, ...items];

  /* 🔥 ambil width asli (biar UI gak berubah) */
  useEffect(() => {
    const update = () => {
      const el = trackRef.current;
      if (!el) return;

      const first = el.children[0];
      if (!first) return;

      const gap = 24;
      setCardWidth(first.offsetWidth + gap);
    };

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  /* 🔥 auto scroll */
  useEffect(() => {
    if (!cardWidth) return;

    let raf;
    const speed = 0.4;

    const animate = () => {
      if (!isPausedRef.current && !isDragging.current) {
        setOffset(prev => {
          const max = items.length * cardWidth;

          let next = prev + speed;
          if (next >= max) return 0;

          return next;
        });
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [cardWidth, items.length]);

  /* ========================= */
  /* 🔥 DRAG HANDLER (FIXED) */
  /* ========================= */

  const handleStart = (clientX) => {
    isDragging.current = true;
    isPausedRef.current = true;

    startX.current = clientX;
    startOffset.current = offset;
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;

    const delta = clientX - startX.current;

    setOffset(startOffset.current - delta);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;

    isDragging.current = false;

    setTimeout(() => {
      isPausedRef.current = false;
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
    >
      <h3 className="text-lg font-semibold mb-4">
        <span className={`px-3 py-1 rounded-lg text-sm ${categoryColors[category]}`}>
          {categoryLabels[category] || category}
        </span>
      </h3>

      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* GRADIENT EDGE */}
        <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* TRACK */}
        <div
          ref={trackRef}
          className="flex gap-6 px-6 py-4"
          style={{
            transform: `translateX(-${offset}px)`,
            willChange: 'transform',
          }}
        >
          {loopItems.map((skill, i) => {
            const isActive = activeIndex === i;

            return (
              <Card
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                className="min-w-[300px] flex-shrink-0 
                           bg-card/90 backdrop-blur-xl
                           border border-border
                           rounded-2xl
                           shadow-sm hover:shadow-xl
                           transition-all duration-300 ease-out
                           hover:-translate-y-2"
                style={{
                  transform: isActive
                    ? 'scale(1.07)'
                    : activeIndex !== null
                    ? 'scale(0.95)'
                    : 'scale(1)',
                  opacity: isActive
                    ? 1
                    : activeIndex !== null
                    ? 0.5
                    : 1,
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <CardContent className="p-5">
                  {/* ICON */}
                  <div className="flex items-start gap-3 mb-3">
                    {skill.icon ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={`${BASE_URL}/${skill.icon}`}
                          alt={skill.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[skill.category] || categoryColors.other}`}>
                        <Code2 className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">
                        {skill.name}
                      </h4>

                      {skill.proficiency && (
                        <Badge
                          variant="secondary"
                          className={`text-xs mt-1 ${proficiencyColors[skill.proficiency]}`}
                        >
                          {proficiencyLabels[skill.proficiency]}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* PROGRESS */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="font-semibold text-primary">
                        {skill.level}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

/* ========================= */
/* 🔥 MAIN SECTION */
/* ========================= */
export default function SkillsSection({ skills }) {
  if (!skills || skills.length === 0) return null;

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 px-6 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Skills"
          subtitle="Technologies and tools I work with"
        />

        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items], idx) => (
            <SkillCarousel
              key={category}
              items={items}
              category={category}
              idx={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}