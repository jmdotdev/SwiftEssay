import { SideNav } from "@/types/sideNav"
import { Banknote, GraduationCap, LayoutDashboard, ShoppingBag } from "lucide-react"


export const sideNavLinks: SideNav[] = [
    {
        name: 'Dashboard',
        icon:  LayoutDashboard,
        url:  'dashboard',
        isActive: true
    },
    {
        name: 'Writers',
        icon: GraduationCap,
        url: 'writers',
        isActive: false
    },
    {
        name: 'Orders',
        icon: ShoppingBag,
        url: 'orders',
        isActive: false
    },
    {
        name: 'Payments',
        icon: Banknote,
        url: 'payments',
        isActive: false
    }
]