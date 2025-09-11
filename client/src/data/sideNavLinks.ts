import { SideNav } from "@/types/sideNav"
import { Banknote, GraduationCap, LayoutDashboard, ShoppingBag } from "lucide-react"


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