'use client';

import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarFooter,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Home,
  HeartPulse,
  Baby,
  ShoppingBag,
  Hospital,
  UserCircle,
  BotMessageSquare,
  Pill,
  CalendarCheck,
  BookOpen,
  FileText,
  ShieldCheck,
  BarChart3,
  Activity,
  Apple,
  MapPin,
  ClipboardList,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LinkComponent } from '@/components/app/link-component'; // Ensure LinkComponent is imported

export function AppSidebar() {
  const pathname = usePathname();
  const [motherOpen, setMotherOpen] = useState(pathname.startsWith('/dashboard/mother'));
  const [childOpen, setChildOpen] = useState(pathname.startsWith('/dashboard/child'));

   const isActive = (path: string) => pathname === path;
   const isSubActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      <SidebarHeader className="p-4">
        {/* Use LinkComponent without asChild for simple logo link */}
        <LinkComponent href="/dashboard" className="flex items-center gap-2 text-primary font-semibold text-lg">
           Navarah
        </LinkComponent>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Use LinkComponent with asChild wrapping SidebarMenuButton */}
            <LinkComponent href="/dashboard" asChild>
              <SidebarMenuButton isActive={isActive('/dashboard')} tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </LinkComponent>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setMotherOpen(!motherOpen)}
              isActive={isSubActive('/dashboard/mother')}
              tooltip="Mother Care"
              aria-expanded={motherOpen}
            >
              <HeartPulse />
              <span>Mother</span>
            </SidebarMenuButton>
            {motherOpen && (
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                   {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/mother/appointments" asChild>
                      <SidebarMenuSubButton isActive={isActive('/dashboard/mother/appointments')}>
                        <CalendarCheck />
                        <span>Appointments</span>
                      </SidebarMenuSubButton>
                   </LinkComponent>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                   {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/mother/medications" asChild>
                      <SidebarMenuSubButton isActive={isActive('/dashboard/mother/medications')}>
                        <Pill />
                        <span>Medications</span>
                      </SidebarMenuSubButton>
                   </LinkComponent>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/mother/reports" asChild>
                     <SidebarMenuSubButton isActive={isActive('/dashboard/mother/reports')}>
                       <BarChart3 />
                       <span>Health Reports</span>
                     </SidebarMenuSubButton>
                   </LinkComponent>
                </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/mother/vitals" asChild>
                     <SidebarMenuSubButton isActive={isActive('/dashboard/mother/vitals')}>
                       <Activity />
                       <span>Vital Tracking</span>
                     </SidebarMenuSubButton>
                   </LinkComponent>
                 </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setChildOpen(!childOpen)}
              isActive={isSubActive('/dashboard/child')}
              tooltip="Child Care"
              aria-expanded={childOpen}
            >
              <Baby />
              <span>Child</span>
            </SidebarMenuButton>
            {childOpen && (
              <SidebarMenuSub>
                 <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/child/vaccinations" asChild>
                     <SidebarMenuSubButton isActive={isActive('/dashboard/child/vaccinations')}>
                       <ShieldCheck />
                       <span>Vaccinations</span>
                     </SidebarMenuSubButton>
                   </LinkComponent>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/child/checkups" asChild>
                     <SidebarMenuSubButton isActive={isActive('/dashboard/child/checkups')}>
                       <ClipboardList />
                       <span>Health Checkups</span>
                     </SidebarMenuSubButton>
                   </LinkComponent>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                    <LinkComponent href="/dashboard/child/diet" asChild>
                     <SidebarMenuSubButton isActive={isActive('/dashboard/child/diet')}>
                       <Apple />
                       <span>Dietary Plans</span>
                     </SidebarMenuSubButton>
                    </LinkComponent>
                 </SidebarMenuSubItem>
                 <SidebarMenuSubItem>
                    {/* Use LinkComponent with asChild wrapping SidebarMenuSubButton */}
                   <LinkComponent href="/dashboard/child/centers" asChild>
                      <SidebarMenuSubButton isActive={isActive('/dashboard/child/centers')}>
                        <MapPin />
                        <span>Nearby Centers</span>
                      </SidebarMenuSubButton>
                   </LinkComponent>
                 </SidebarMenuSubItem>
              </SidebarMenuSub>
            )}
          </SidebarMenuItem>

          <SidebarSeparator />

          <SidebarMenuItem>
             {/* Use LinkComponent with asChild wrapping SidebarMenuButton */}
             <LinkComponent href="/dashboard/marketplace" asChild>
                <SidebarMenuButton isActive={isActive('/dashboard/marketplace')} tooltip="Marketplace">
                  <ShoppingBag />
                  <span>Marketplace</span>
                </SidebarMenuButton>
             </LinkComponent>
          </SidebarMenuItem>
          <SidebarMenuItem>
             {/* Use LinkComponent with asChild wrapping SidebarMenuButton */}
             <LinkComponent href="/dashboard/hospitals" asChild>
                <SidebarMenuButton isActive={isActive('/dashboard/hospitals')} tooltip="Hospitals">
                  <Hospital />
                  <span>Hospitals</span>
                </SidebarMenuButton>
             </LinkComponent>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {/* Use LinkComponent with asChild wrapping SidebarMenuButton */}
            <LinkComponent href="/dashboard/knowledge" asChild>
              <SidebarMenuButton isActive={isActive('/dashboard/knowledge')} tooltip="Knowledge Base">
                <BookOpen />
                <span>Knowledge Base</span>
              </SidebarMenuButton>
            </LinkComponent>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
             {/* Use LinkComponent with asChild wrapping SidebarMenuButton */}
             <LinkComponent href="/dashboard/profile" asChild>
                <SidebarMenuButton isActive={isActive('/dashboard/profile')} tooltip="Profile">
                  <UserCircle />
                  <span>Profile</span>
                </SidebarMenuButton>
             </LinkComponent>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
