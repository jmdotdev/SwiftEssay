import { Banknote, GraduationCap, LayoutDashboard, LayoutDashboardIcon, LayoutGrid, ShoppingBag } from "lucide-react"
import { SideNav } from "../types/sideNav"


export const sideNavLinks: SideNav[] = [
    {
        name: 'Dashboard',
        icon:  LayoutDashboard,
        url:  'dashboard'
    },
    {
        name: 'Writers',
        icon: GraduationCap,
        url: 'writers'
    },
    {
        name: 'Orders',
        icon: ShoppingBag,
        url: 'orders'
    },
    {
        name: 'Payments',
        icon: Banknote,
        url: 'payments'
    }
]