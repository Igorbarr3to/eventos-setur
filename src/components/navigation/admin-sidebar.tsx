import { DownloadIcon, Home, SearchIcon, User2Icon, } from "lucide-react"

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
} from "@/components/ui/sidebar"

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import SingOutButton from "./signOut-button";

export async function AppSidebar() {
    const session = await getServerSession(authOptions);

    return (
        <Sidebar className="w-64 h-screen bg-white shadow-md">
            <SidebarHeader className="text-center text-2xl font-bold">
                MoniTUR
            </SidebarHeader>
            <SidebarContent className="bg-blue-500 text-white">
                <SidebarGroup>
                    <SidebarGroupContent >
                        <SidebarMenu className="space-y-2">
                            <SidebarMenuButton>
                                <a href="/dashboard" className="flex items-center gap-2">
                                    <Home size={20}/>
                                    <span className="text-lg">Home</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <a href="/cadastrar-usuario" className="flex items-center gap-2">
                                    <User2Icon size={20}/>
                                    <span className="text-lg">Cadastrar usuário</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <a href="#" className="flex items-center gap-2">
                                    <SearchIcon size={20}/>
                                    <span className="text-lg">Pesquisas</span>
                                </a>
                            </SidebarMenuButton>
                            <SidebarMenuButton>
                                <a href="#" className="flex items-center gap-2">
                                    <DownloadIcon size={20}/>
                                    <span className="text-lg">Importar dados</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex flex-row justify-between items-center text-lg text-gray-500">
                {session?.user.name}
                <SingOutButton />
            </SidebarFooter>
        </Sidebar>
    )
}