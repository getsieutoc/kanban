'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/icons';

export const Cta1 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="bg-muted/80 flex flex-col items-center gap-8 rounded-md p-4 text-center lg:p-14">
        <div className="flex flex-col gap-2">
          <h3 className="font-regular max-w-xl text-3xl tracking-tighter md:text-5xl">
            Ready to build this dream with us?
          </h3>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed tracking-tight">
            Don&apos;t let stagnant growth hold you back. Connect with us today
            to identify and overcome your business challenges.
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg">
                Join the Fair Music Revolution <Calendar className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-5/6 w-5/6 max-w-none">
              <iframe
                src="https://calendly.com/sieutoc"
                className="h-full w-full border-0"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  </div>
);
