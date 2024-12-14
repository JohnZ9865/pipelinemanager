'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const getLinkClass = (path) => {
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      pathname === path
        ? 'border-indigo-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`;
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link href="/" className={getLinkClass('/')}>
              Pipeline
            </Link>
            {/* <Link href="/finished" className={getLinkClass('/finished')}>
              Finished
            </Link>
            <Link href="/dead" className={getLinkClass('/dead')}>
              Dead
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
