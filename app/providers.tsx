'use client';

import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/shared/apollo/client';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#334155',
            color: '#f1f5f9',
          },
        }}
      />
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/20">
        {children}
      </main>
    </ApolloProvider>
  );
}
