'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from '@/components/icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ComboData = {
  label: string;
  value: string;
};

type Props = {
  data: ComboData[];
  value: string;
  onChange: (value: string) => void;
  onOpen: () => void;
  placeholder?: string;
  className?: string;
};

export function ComboBox({
  data,
  onOpen,
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = (newState: boolean) => {
    setOpen(newState);
    onOpen();
  };

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {value
            ? data.find((item) => item.value === value)?.label
            : placeholder || '---'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-8" />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {data.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? '' : currentValue);
                    handleOpen(false);
                  }}
                >
                  {item.label}
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
