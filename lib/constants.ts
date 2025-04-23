import { DashboardNavIcons } from '@/components/icons';

export const IS_PROD = process.env.NODE_ENV === 'production';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const SIDEBAR_COOKIE_NAME = 'sidebar_state';
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
export const SIDEBAR_WIDTH = '18rem';
export const SIDEBAR_WIDTH_MOBILE = '18rem';
export const SIDEBAR_WIDTH_ICON = '3rem';
export const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type NavItem = {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof DashboardNavIcons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Albums',
    url: '/dashboard/albums',
    icon: 'library',
    shortcut: ['t', 't'],
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Tracks',
    url: '/dashboard/tracks',
    icon: 'music',
    shortcut: ['t', 't'],
    isActive: false,
    items: [], // No child items
  },

  {
    title: 'Account',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm'],
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login',
      },
    ],
  },
];
