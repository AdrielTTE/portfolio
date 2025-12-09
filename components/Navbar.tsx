import Link from 'next/link';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-10 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
    {/* Logo or Portfolio Name */}
    <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-400 transition-colors">
      Adriel Tang Thien Ern
    </Link>
        
        {/* Navigation Links */}
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}