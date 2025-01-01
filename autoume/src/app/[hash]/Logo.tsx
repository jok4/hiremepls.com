import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export const Logo = () => (
  <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
    <div className="flex justify-center items-center">
      <div className="h-8 w-8 sm:h-12 sm:w-12 bg-blue-50 rounded-full flex items-center justify-center">
        <Briefcase className="h-4 w-4 sm:h-6 sm:w-6 text-blue-500" />
      </div>
      <div className='text-gray-600 font-bold text-sm sm:text-base ml-2'>Hireme.pls</div>
    </div>
  </Link>
);