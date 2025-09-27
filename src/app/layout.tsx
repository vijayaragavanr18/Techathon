import './globals.css';
import type { ReactNode } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app/app-sidebar';
import { Header, FloatingChatbot } from '@/components/app/header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Navarah',
  description: 'Healthcare Management System',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen>
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <FloatingChatbot />
      </body>
    </html>
  );
}
