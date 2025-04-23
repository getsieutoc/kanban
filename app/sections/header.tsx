'use client';

import { StaticLogo } from '@/components/common/logo';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserProfile } from '@/components/common/user-profile';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Menu, MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const Header = () => {
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: '',
    },
    {
      title: 'Services',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'Reports',
          href: '/reports',
        },
        {
          title: 'Statistics',
          href: '/statistics',
        },
        {
          title: 'Dashboards',
          href: '/dashboards',
        },
        {
          title: 'Recordings',
          href: '/recordings',
        },
      ],
    },
    {
      title: 'Company',
      description: 'Managing a small business today is already tough.',
      items: [
        {
          title: 'About us',
          href: '/about',
        },
        {
          title: 'Fundraising',
          href: '/fundraising',
        },
        {
          title: 'Investors',
          href: '/investors',
        },
        {
          title: 'Contact us',
          href: '/contact',
        },
      ],
    },
  ];
  const { session } = useAuth();

  const [isOpen, setOpen] = useState(false);

  return (
    <header
      className={`bg-card fixed top-0 left-0 z-40 w-full transition-colors duration-300`}
    >
      <div className="relative container mx-auto flex min-h-20 flex-row items-center justify-between gap-4">
        <StaticLogo />

        {/*
        <div className="hidden flex-row items-center justify-start gap-4 lg:flex">
          <NavigationMenu className="flex items-start justify-start">
            <NavigationMenuList className="flex flex-row justify-start gap-4">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <>
                      <NavigationMenuLink>
                        <Button variant="ghost" size="sm">
                          {item.title}
                        </Button>
                      </NavigationMenuLink>
                    </>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="text-sm font-medium">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex grid-cols-2 flex-col gap-4 lg:grid">
                          <div className="flex h-full flex-col justify-between">
                            <div className="flex flex-col">
                              <p className="text-base">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-10">
                              Book a call today
                            </Button>
                          </div>
                          <div className="flex h-full flex-col justify-end text-sm">
                            {item.items?.map((subItem) => (
                              <NavigationMenuLink
                                href={subItem.href}
                                key={subItem.title}
                                className="hover:bg-muted flex flex-row items-center justify-between rounded px-4 py-2"
                              >
                                <span>{subItem.title}</span>
                                <MoveRight className="text-muted-foreground h-4 w-4" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        */}

        <div className="flex w-auto items-center justify-end gap-4 space-x-2">
          <ThemeToggle />

          <Separator orientation="vertical" />

          {session ? (
            <UserProfile />
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          )}
        </div>

        <div className="flex w-12 shrink items-end justify-end lg:hidden">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          {isOpen && (
            <div className="bg-background absolute top-20 right-0 container flex w-full flex-col gap-8 border-t py-4 shadow-lg">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center justify-between"
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="text-muted-foreground h-4 w-4 stroke-1" />
                      </Link>
                    ) : (
                      <p className="text-lg">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="flex items-center justify-between"
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="h-4 w-4 stroke-1" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
