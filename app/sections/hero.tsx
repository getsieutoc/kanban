'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoveRight } from 'lucide-react';
import { motion } from 'framer-motion';

const titles = ['developers', 'indie hackers', 'startup founders', 'small businesses'];

export const Hero = () => {
  const [titleNumber, setTitleNumber] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [titleNumber]);

  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center gap-8 pt-60 pb-40">
          <div className="flex flex-col gap-4">
            <h1 className="max-w-2xl text-center text-5xl font-medium tracking-tighter">
              <span className="text-spektr-cyan-50">
                Super simple self hosted kanban for
              </span>
              <span className="relative flex w-full justify-center overflow-hidden pt-2 pb-6 text-center">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="text-primary absolute text-6xl font-bold"
                    initial={{ opacity: 0, y: '-100' }}
                    transition={{ type: 'spring', stiffness: 60, bounce: 0.25 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-muted-foreground max-w-2xl text-center text-lg leading-relaxed tracking-tight md:text-xl">
              Tired of tech giants pocketing billions while artists and
              developers struggle? Kanban flips the script: 100% of profits go
              back to creators and community.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button variant="outline" size="lg" className="gap-4">
              Get Started <MoveRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
