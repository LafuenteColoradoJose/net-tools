'use client'; // Importante para componentes con interactividad client-side
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="py-4 text-center text-white bg-gray-800">
      <div className="flex items-center justify-between px-4">
        <div className="md:hidden"></div>
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
      </div>
      <div className={`md:flex ${isOpen ? 'block' : 'hidden'} justify-center`}>
        <ul className="flex flex-wrap justify-center text-sm md:flex-row">
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/host-capacity" className="hover:text-gray-300">Host Capacity</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/mask-to-prefix" className="hover:text-gray-300">Mask to Prefix</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/network-address" className="hover:text-gray-300">Network Address</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/prefix-to-mask" className="hover:text-gray-300">Prefix to Mask</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/subnet-count" className="hover:text-gray-300">Subnet Count</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/subnet-info" className="hover:text-gray-300">Subnet Info</Link>
          </li>
          <li className='flex flex-col items-center justify-center w-16 h-16 m-2 border-2 border-gray-200 rounded-xl sm:w-24 sm:h-24 md:h-12 md:m-1'>
            <Link href="/subnet-vlsm" className="hover:text-gray-300">Subnet VLSM</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
