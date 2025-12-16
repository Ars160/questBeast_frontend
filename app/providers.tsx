'use client';

import { ApolloProvider } from '@apollo/client/react';
import { client } from '@/shared/apollo/client';
import Navbar from './Navbar';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/20">
        {children}
      </main>
    </ApolloProvider>
  );
}
