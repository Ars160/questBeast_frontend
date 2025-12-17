"use client";

import { useAuthStore } from '@/shared/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const Wrapper = (props: P) => {
    const { token, hydrate } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      hydrate(); 
    }, [hydrate]);

    useEffect(() => {
      if (token === null) {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          toast.error('Для доступа к этой странице нужно войти в систему.');
          router.replace('/auth/login');
        }
      }
    }, [token, router]);

    if (!token) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
