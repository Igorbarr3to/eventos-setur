
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@prisma/client";

const editUserSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres.").optional(),
    email: z.string().email("Formato de email inválido.").optional(),
    role: z.nativeEnum(UserRole).optional(),
});

export async function DELETE(
    request: NextRequest,
    { params }: {
        params: { id: string }
    }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    try {
        const userIdToDelete = parseInt(params.id, 10);
        if (isNaN(userIdToDelete)) {
            return NextResponse.json({ message: 'ID de usuário inválido.' }, { status: 400 });
        }

        if (session.user.id === userIdToDelete) {
            return NextResponse.json(
                { message: 'Não é permitido excluir a própria conta de administrador.' },
                { status: 403 }
            );
        }

        const userExists = await prisma.user.findUnique({
            where: { id: userIdToDelete },
        });
        if (!userExists) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

        await prisma.user.delete({
            where: { id: userIdToDelete },
        });

        return NextResponse.json({ message: 'Usuário excluído com sucesso.' }, { status: 200 });

    }catch (error) {
        console.error("Erro ao excluir usuário:", error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Proteger o endpoint
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    try {

        const {id} = await params;

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return NextResponse.json({ message: 'ID de usuário inválido.' }, { status: 400 });
        }

        const json = await request.json();
        const data = editUserSchema.parse(json);

        // Verificar se o usuário que será editado existe
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!existingUser) {
            return NextResponse.json({ message: 'Usuário não encontrado.' }, { status: 404 });
        }

        // Se o email estiver sendo alterado, verificar se o novo email já não está em uso por outro usuário
        if (data.email && data.email !== existingUser.email) {
            const emailInUse = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (emailInUse) {
                return NextResponse.json({ message: 'Este e-mail já está em uso por outra conta.' }, { status: 409 });
            }
        }

        // Atualizar o usuário no banco
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
                role: data.role,
            },
        });

        const { password, ...userWithoutPassword } = updatedUser;
        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Dados inválidos', issues: error.issues }, { status: 400 });
        }
        console.error("Erro ao atualizar usuário:", error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    }
}