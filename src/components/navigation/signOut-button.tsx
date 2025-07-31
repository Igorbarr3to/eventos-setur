'use client';

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SingOutButton(){
    return (
        <Button onClick={() => {
            signOut();
        }}
        variant="outline"
        className="bg-red-500 text-white hover:bg-red-600 hover:text-white transition-colors"
        >
            Sair
        </Button>
    );
}