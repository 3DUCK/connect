import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ko', 'zh', 'fr', 'ja'],
  defaultLocale: 'en',
  localeDetection: false
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
