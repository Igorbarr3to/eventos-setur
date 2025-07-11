'use client'

import CriarUsuariosModal from "@/components/usuarios/criar-usuarios-modal";
import CadastrarUsuarioPage from "@/components/usuarios/tabela-usuarios";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";

type SafeUser = Omit<User, 'password' | 'emailVerified'>;

export default function UsuariosPage() {
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/usuarios');
            if (!response.ok) throw new Error('Erro ao buscar usuários');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    return (
        <div className="flex flex-col items-center min-h-screen gap-2">
            <h1 className="text-2xl font-bold mb-4 text-center">Usuários</h1>
            <div className="w-full">
                <CriarUsuariosModal
                    onUserCreated={fetchUsers}
                />
            </div>
            <CadastrarUsuarioPage
                users={users}
                onUserListChange={fetchUsers}
                isLoading={isLoading}
            />
        </div>
    );
}