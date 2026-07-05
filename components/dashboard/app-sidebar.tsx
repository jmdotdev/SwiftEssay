'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  LogOut,
  PenTool,
  ClipboardList,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUser } from '@/lib/hooks'
import type { UserRole } from '@/lib/types'


interface AppSidebarProps {
  role: UserRole
}

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Writers',
    href: '/admin/writers',
    icon: Users,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: FileText,
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
]

const writerNavItems = [
  {
    title: 'Dashboard',
    href: '/writer',
    icon: LayoutDashboard,
  },
  {
    title: 'Available Orders',
    href: '/writer/orders',
    icon: FileText,
  },
  {
    title: 'My Orders',
    href: '/writer/my-orders',
    icon: ClipboardList,
  },
  {
    title: 'Payments',
    href: '/writer/payments',
    icon: CreditCard,
  },
]

export function AppSidebar({ role }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const navItems = role === 'admin' ? adminNavItems : writerNavItems
  const rootHref = role === 'admin' ? '/admin' : '/writer'
  const { data: currentUser } = useCurrentUser()
  const user = {
    name: currentUser?.username || (role === 'admin' ? 'Admin' : 'Writer'),
    email: currentUser?.email || '',
  }

  const logout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
    }).then(() => {
      router.push('/login')
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href={role === 'admin' ? '/admin' : '/writer'} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <PenTool className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Swift Essay</span>
            <span className="text-xs text-muted-foreground capitalize">{role} Panel</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === rootHref
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + '/')
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            {role === 'writer' ? (
              <SidebarMenuButton size="lg" className="w-full" asChild tooltip="View profile">
                <Link href="/writer/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col text-left text-sm">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton size="lg" className="w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col text-left text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <div onClick={logout} className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
