'use client';

import { User } from "@prisma/client";

type SafeUser = Omit<User, 'password' | 'emailVerified'>;

interface TabelaUsuariosProps {
  users: SafeUser[];
  isLoading: boolean;
}
export default function CadastrarUsuarioPage({ users, isLoading }: TabelaUsuariosProps) {

    if (isLoading) {
        return <p>Carregando usuários...</p>;
    }
   
    return (
        <>
            {users.length > 0 ? (
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr className="text-left border">
                            <th className="p-2">Nome</th>
                            <th className="p-2">E-mail</th>
                            <th className="p-2">Função</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="rounded-lg border border-gray-300 hover:bg-gray-100 ">
                                <td className="p-2 ">{user.name}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.role === "ADMIN" ? 'Administrador' : 'Usuário'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhum usuário encontrado.</p>
            )}

        </>
    );
}