import Link from "next/link";

interface NavigationItem {
  slug: string;
  title: string;
}

interface CircularNavigationProps {
  previousItem?: NavigationItem | null;
  nextItem?: NavigationItem | null;
  basePath: string;
  centerLink?: {
    href: string;
    label: string;
  };
}

export default function CircularNavigation({
  previousItem,
  nextItem,
  basePath,
  centerLink,
}: CircularNavigationProps) {
  return (
    <nav
      className="mt-12 pt-8 border-t border-gray-800"
      aria-label="Post navigation"
    >
      <div className="flex justify-between items-center">
        {/* Previous Item */}
        <div className="flex-1">
          {previousItem && (
            <Link
              href={`${basePath}/${previousItem.slug}`}
              className="group flex items-center space-x-3 text-gray-400 hover:text-white"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="text-sm hidden md:block">
                  {previousItem.title}
                </span>
              </div>
            </Link>
          )}
        </div>

        {/* Center Link */}
        {centerLink && (
          <div className="flex-shrink-0 mx-8">
            <Link
              href={centerLink.href}
              className="text-gray-400 hover:text-white text-sm underline underline-offset-2"
            >
              {centerLink.label}
            </Link>
          </div>
        )}

        {/* Next Item */}
        <div className="flex-1 flex justify-end">
          {nextItem && (
            <Link
              href={`${basePath}/${nextItem.slug}`}
              className="group flex items-center space-x-3 text-gray-400 hover:text-white"
            >
              <div className="flex items-center space-x-2">
                <span className="text-sm hidden md:block">
                  {nextItem.title}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
