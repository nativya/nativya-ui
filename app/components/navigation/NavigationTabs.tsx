import Link from 'next/link';

export type Tab = {
  id: string;
  label: string;
  icon: string;
  badge?: number;
};

interface NavigationTabsProps {
  tabs: Tab[];
  currentTab?: string;
  pathname: string;
  isClient: boolean;
  isMobile: boolean;
  onMobileClose?: () => void;
}

export function NavigationTabs({ tabs, currentTab, pathname, isClient, isMobile, onMobileClose }: NavigationTabsProps) {
  return (
    <div className={isMobile ? 'flex flex-col gap-4' : 'flex items-center gap-6'}>
      {tabs.map((tab) => {
        const isActive = currentTab ? currentTab === tab.id :
          (tab.id === 'tasks' && pathname.startsWith('/home')) ||
          (tab.id === 'dashboard' && pathname.startsWith('/dashboard'));
        return (
          <Link
            key={tab.id}
            href={tab.id === 'tasks' ? '/home' : '/dashboard'}
            className={
              (isMobile
                ? 'w-full flex items-center px-4 py-3 rounded-lg font-semibold text-base '
                : 'inline-flex items-center px-3 py-2 rounded-lg font-semibold text-base '
              ) +
              'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ' +
              (isActive
                ? 'bg-blue-100 text-blue-700 shadow border-2 border-blue-500'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 border-2 border-transparent')
            }
            aria-current={isActive ? 'page' : undefined}
            onClick={isMobile && onMobileClose ? onMobileClose : undefined}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
            {tab.badge && tab.badge > 0 && isClient && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
} 