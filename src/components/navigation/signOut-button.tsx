'use client';

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SingOutButton(){
    return (
        <Button onClick={() => {
            signOut();
        }}
        variant="outline"
        className="hover:bg-red-500 hover:text-white text-red-500 border-red-500"
        >
            Sair
        </Button>
    );
}