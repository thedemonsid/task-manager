"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FiHome, FiInfo, FiBarChart2, FiLogOut, FiMenu } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Check if token exists in cookies
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);

    // Try to get user email from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    // Remove token from cookies and localStorage
    Cookies.remove("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");

    setIsLoggedIn(false);
    // Redirect to login
    router.push("/login");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white font-medium text-lg">
              TaskManager
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive("/")
                      ? "text-white bg-zinc-800/50 rounded-md"
                      : "text-zinc-300 hover:text-white"
                  }`}
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/tasks"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive("/tasks")
                      ? "text-white bg-zinc-800/50 rounded-md"
                      : "text-zinc-300 hover:text-white"
                  }`}
              >
                <FaTasks className="w-4 h-4" />
                <span>Tasks</span>
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive("/about")
                      ? "text-white bg-zinc-800/50 rounded-md"
                      : "text-zinc-300 hover:text-white"
                  }`}
              >
                <FiInfo className="w-4 h-4" />
                <span>About</span>
              </Link>
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive("/dashboard")
                      ? "text-white bg-zinc-800/50 rounded-md"
                      : "text-zinc-300 hover:text-white"
                  }`}
              >
                <FiBarChart2 className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger className="md:hidden px-2 py-4 rounded-md">
                <FiMenu className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="bg-transparent pt-4">
                <div className="flex flex-col gap-6 mt-8">
                  <Link
                    href="/"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive("/") ? "bg-zinc-800/70" : "hover:bg-zinc-800/40"
                    }`}
                  >
                    <FiHome className="w-5 h-5" />
                    <span className="text-base">Home</span>
                  </Link>
                  <Link
                    href="/tasks"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive("/tasks")
                        ? "bg-zinc-800/70"
                        : "hover:bg-zinc-800/40"
                    }`}
                  >
                    <FaTasks className="w-5 h-5" />
                    <span className="text-base">Tasks</span>
                  </Link>
                  <Link
                    href="/about"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive("/about")
                        ? "bg-zinc-800/70"
                        : "hover:bg-zinc-800/40"
                    }`}
                  >
                    <FiInfo className="w-5 h-5" />
                    <span className="text-base">About</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-md ${
                      isActive("/dashboard")
                        ? "bg-zinc-800/70"
                        : "hover:bg-zinc-800/40"
                    }`}
                  >
                    <FiBarChart2 className="w-5 h-5" />
                    <span className="text-base">Dashboard</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>

            {/* User menu - same for both desktop and mobile */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarFallback className="bg-red-400 text-white">
                      {getInitials(userEmail)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-zinc-900 border-zinc-800"
                >
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium text-white">{userEmail}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="cursor-pointer flex items-center gap-2 focus:bg-zinc-800 text-zinc-200"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="cursor-pointer">Sign in</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
