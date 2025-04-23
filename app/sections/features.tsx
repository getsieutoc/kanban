import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const Feature1 = () => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="grid border rounded-lg container p-8 grid-cols-1 gap-8 items-center lg:grid-cols-2">
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 flex-col">
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl lg:text-5xl tracking-tighter max-w-xl text-left font-regular">
                We build in public
              </h2>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                All the income we generate from our products goes back into
                building more products and equally paying to artists and
                contributors.
              </p>
            </div>
          </div>
          <div className="grid lg:pl-6 grid-cols-1 sm:grid-cols-3 items-start lg:grid-cols-1 gap-6">
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Transparent from day zero</p>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve made it transparent from day zero.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Fast and reliable</p>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve made it fast and reliable.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Beautiful and modern</p>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve made it beautiful and modern.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted rounded-md aspect-square"></div>
      </div>
    </div>
  </div>
);

type FeatureProps = {
  title: string;
  content: string;
};

export const FeatureLeft = ({ title, content }: FeatureProps) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col-reverse lg:flex-row gap-10 lg:items-center">
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
        <div className="flex gap-4 pl-0 lg:pl-20 flex-col  flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl tracking-tighter lg:max-w-xl font-regular text-left">
              {title}
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const FeatureRight = ({ title, content }: FeatureProps) => (
  <div className="w-full py-20 lg:py-40">
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
        <div className="flex gap-4 flex-col flex-1">
          <div className="flex gap-2 flex-col">
            <h2 className="text-xl md:text-3xl tracking-tighter lg:max-w-xl font-regular text-left">
              {title}
            </h2>
            <p className="text-lg max-w-xl lg:max-w-sm leading-relaxed tracking-tight text-muted-foreground text-left">
              {content}
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-md w-full aspect-video h-full flex-1"></div>
      </div>
    </div>
  </div>
);
