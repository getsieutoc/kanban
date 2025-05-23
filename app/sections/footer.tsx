'use client';

import { LogoMark } from '@/components/common/logo';
import Link from 'next/link';

export const GeneralFooter = () => {
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: '',
    },
    {
      title: 'Product',
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
          title: 'boardss',
          href: '/boardss',
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

  return (
    <div className="w-full lg:py-40">
      <div className="container mx-auto border-t border-border py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="flex gap-8 flex-col items-start">
            <div className="flex gap-0 flex-col">
              <div className="flex flex-col align-center justify-start gap-0">
                <LogoMark className="h-12 w-12" />
                <h2 className="text-2xl md:text-3xl tracking-tighter max-w-xl font-bold text-left">
                  Kanban
                </h2>
              </div>
              <p className="text-lg max-w-lg leading-relaxed tracking-tight text-left">
                for Indie Hackers
              </p>
            </div>

            <div className="flex gap-20 flex-row">
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-left">
                <p>Vantaa, Finland</p>
              </div>
              <div className="flex flex-col text-sm max-w-lg leading-relaxed tracking-tight text-left">
                <Link href="/">Terms of service</Link>
                <Link href="/">Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-10 items-start">
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className="flex text-base gap-1 flex-col items-start"
              >
                <div className="flex flex-col gap-2">
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex justify-between items-center"
                    >
                      <span className="text-xl">{item.title}</span>
                    </Link>
                  ) : (
                    <p className="text-xl">{item.title}</p>
                  )}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex justify-between items-center"
                      >
                        <span className="">{subItem.title}</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
