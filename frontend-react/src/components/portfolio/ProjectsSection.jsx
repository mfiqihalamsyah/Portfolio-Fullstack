import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from './SectionHeading';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Github } from 'lucide-react';

const BASE_URL = "http://127.0.0.1:8000/storage/";

export default function ProjectsSection({ projects }) {

/* ========================= */
/* 🔥 CAROUSEL */
/* ========================= */
  const trackRef = useRef(null);

  const [offset, setOffset] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);

  const isPausedRef = useRef(false);
  const isDragging = useRef(false);
  
  const startX = useRef(0);
  const startOffset = useRef(0);

  const loopProjects = [...projects, ...projects];

  /* 🔥 ambil width asli (biar UI gak berubah) */
  useEffect(() => {
    const updateWidth = () => {
      const el = trackRef.current;
      if (!el) return;

      const first = el.children[0];
      if (!first) return;

      const gap = 24;
      setCardWidth(first.offsetWidth + gap);
    };
    
      const observer = new ResizeObserver(updateWidth);
      if (trackRef.current) {
        observer.observe(trackRef.current);
      }
      
    return () => window.removeEventListener('resize', updateWidth);
  }, [projects]);

  /* 🔥 AUTO SCROLL */
  useEffect(() => {
    if (!cardWidth) return;

    let raf;
    const speed = 0.4;

    const animate = () => {
      if (!isPausedRef.current && !isDragging.current) {
        setOffset(prev => {
          const max = projects.length * cardWidth;

          let next = prev + speed;

          if (next >= max) return 0;

          return next;
        });
      }

      raf = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(raf);
  }, [cardWidth, projects.length]);

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
  
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-24 px-6 scroll-mt-24">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Projects" subtitle="Some things I've built" />

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
          {/* GRADIENT */}
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
            {loopProjects.map((project, i) => {
              const techList = project.technologies?.split(',') || [];
              const isActive = activeIndex === i;

              return (
                <motion.div
                  key={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  className="
                    w-[calc((100%-3rem)/3)]
                    min-w-[280px]
                    flex-shrink-0
                    bg-card/90 backdrop-blur-xl
                    border border-border
                    rounded-2xl
                    shadow-sm hover:shadow-lg
                    transition-all duration-300
                  "
                  style={{
                    transform: isActive
                      ? 'scale(1.06)'
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
                  {/* IMAGE */}
                  <div className="aspect-video overflow-hidden rounded-t-2xl">
                    <img
                      src={
                        project.image
                          ? BASE_URL + project.image
                          : '/no-image.png'
                      }
                      onError={(e) => (e.target.src = '/no-image.png')}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-lg">{project.title}</h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {techList.map((tech, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tech.trim()}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-4 text-sm pt-2">
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" className="text-primary">
                          <ExternalLink className="w-3.5 h-3.5 inline" /> Live
                        </a>
                      )}

                      {project.github_url && (
                        <a href={project.github_url} target="_blank">
                          <Github className="w-3.5 h-3.5 inline" /> Code
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}