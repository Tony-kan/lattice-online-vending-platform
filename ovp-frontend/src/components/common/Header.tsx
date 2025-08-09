// import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { HeaderProps, UserProps } from "@/types/type";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { getInitials } from "@/lib/utils";

const defaultUser: UserProps = {
  id: "0",
  name: "user",
  email: "user@lattice.com",
  role: "admin", // Or any other default/safe role
};

const Header = ({ user = defaultUser, onLogout }: HeaderProps) => {
  return (
    <header className="h-[16vh] flex items-center justify-between px-12">
      {/* Logo */}
      <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent">
        Lattice vending platform
      </h1>

      {/* Auth Section */}
      {!user ? (
        <Button
          variant="default"
          className="bg-amber-500 border-2 rounded-sm border-transparent font-extrabold text-white w-28 hover:text-amber-500 hover:border-amber-500 hover:bg-transparent"
        >
          Sign In
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer bg-amber-500">
              <AvatarFallback className="text-white font-bold">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 bg-white -ml-48 border-amber-500">
            <DropdownMenuLabel className="text-lg font-semibold mt-2 mx-2">
              My Account
            </DropdownMenuLabel>

            <Separator className="bg-amber-600" />

            <div className="px-2 py-2 mx-2">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Role : {user.role}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="text-red-600 cursor-pointer mb-2 mx-2"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
