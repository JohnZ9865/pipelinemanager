'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { collection, addDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../app/firebase/firebaseConfig';

const fetchIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
};

const storeIPAddress = async (ipAddress) => {
  if (!ipAddress) return;
  try {
    const ipDocRef = doc(db, 'user_ips', ipAddress);
    const ipDoc = await getDoc(ipDocRef);

    if (ipDoc.exists()) {
      // If the IP already exists, increment the count
      await updateDoc(ipDocRef, {
        count: (ipDoc.data().count || 1) + 1,
      });
    } else {
      // If the IP doesn't exist, create a new document with count 1
      await setDoc(ipDocRef, {
        ip: ipAddress,
        count: 1,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error storing IP address:', error);
  }
};

const Navbar = () => {
  useEffect(() => {
    const trackUser = async () => {
      const ipAddress = await fetchIPAddress();
      await storeIPAddress(ipAddress);
    };
    trackUser();
  }, []);

  const pathname = usePathname();

  const getLinkClass = (path) => {
    return `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      pathname === path
        ? 'border-blue-500 text-blue-400'
        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
    }`;
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg">
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
