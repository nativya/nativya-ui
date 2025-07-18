import Link from 'next/link';
// NEW: Importing both outline and solid icons for different states
import { HomeIcon as HomeOutline, ChartBarIcon as ChartBarOutline } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid, ChartBarIcon as ChartBarSolid } from '@heroicons/react/24/solid';

// NEW: Icon component that switches between outline and solid based on active state
const TabIcon = ({ name, isActive }: { name: string, isActive: boolean }) => {
  const className = `w-5 h-5`;
  if (name === 'home') {
    return isActive ? <HomeSolid className={className} /> : <HomeOutline className={className} />;
  }
  if (name === 'dashboard') {
    return isActive ? <ChartBarSolid className={className} /> : <ChartBarOutline className={className} />;
  }
  return null;
};

export type Tab = {
  id: string;
  label: string;
  icon: string;
  href: string;
  badge?: number;
};

interface NavigationTabsProps {
  tabs: Tab[];
  pathname: string;
  isClient: boolean;
  isMobile: boolean;
  onMobileClose?: () => void;
}

export function NavigationTabs({ tabs, pathname, isClient, isMobile, onMobileClose }: NavigationTabsProps) {
  return (
    <div className={isMobile ? 'flex flex-col gap-2' : 'flex items-center gap-2'}>
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.id}
            href={tab.href}
            // UPDATED: Modern "pill" style for active links on a light background
            className={
              'group flex items-center gap-2.5 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 ' +
              (isMobile
                ? 'w-full px-4 py-3 ' // Mobile has more padding
                : 'px-4 py-2 ' // Desktop is tighter
              ) +
              (isActive
                ? 'bg-indigo-100 text-indigo-700' // Active state: light indigo pill
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' // Inactive state
              )
            }
            aria-current={isActive ? 'page' : undefined}
            onClick={isMobile && onMobileClose ? onMobileClose : undefined}
          >
            <TabIcon name={tab.icon} isActive={isActive} />
            {tab.label}
            {tab.badge && tab.badge > 0 && isClient && (
              <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${isActive ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-700'}`}>
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
