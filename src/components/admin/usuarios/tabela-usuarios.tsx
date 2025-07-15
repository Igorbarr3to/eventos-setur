// components/admin/usuarios/TabelaUsuarios.tsx

'use client';

import { User } from "@prisma/client";
import EditarUsuarioModal from "./editar-usuarios-modal";
import { DeletarUsuarioModal } from "./deletar-usuario-modal";
type SafeUser = Omit<User, 'password' | 'emailVerified'>;

interface TabelaUsuariosProps {
  users: SafeUser[];
  onUserListChange: () => void; // Função para recarregar a lista
}

export function TabelaUsuarios({ users, onUserListChange }: TabelaUsuariosProps) {
  if (users.length === 0) {
    return <p className="text-muted-foreground mt-4">Nenhum usuário encontrado.</p>;
  }

  return (
    <div className="rounded border-3 border-gray-400">
      <table className="min-w-full  divide-y divide-gray-200">
        <thead className="bg-gray-50 rounded-2xl">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <EditarUsuarioModal user={user} onUserUpdated={onUserListChange} />
                  <DeletarUsuarioModal userId={user.id} onUserDeleted={onUserListChange} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}