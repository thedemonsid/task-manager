"use client";
import Link from "next/link";
import React from "react";
import { FiHome, FiInfo, FiBarChart2 } from "react-icons/fi";
import { FaTasks } from "react-icons/fa";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

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

          <div className="flex items-center">
            <Button className="cursor-pointer">Sign in</Button>
          </div>
        </nav>
      </div>

      {/* Mobile menu - displays only on smaller screens */}
      <div className="md:hidden flex justify-center py-3 ">
        <div className="flex space-x-10">
          <Link
            href="/"
            className={`flex flex-col items-center transition-colors
              ${
                isActive("/") ? "text-white" : "text-zinc-300 hover:text-white"
              }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                isActive("/") ? "bg-zinc-800" : ""
              }`}
            >
              <FiHome className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/about"
            className={`flex flex-col items-center transition-colors
              ${
                isActive("/about")
                  ? "text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                isActive("/about") ? "bg-zinc-800" : ""
              }`}
            >
              <FiInfo className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">About</span>
          </Link>
          <Link
            href="/dashboard"
            className={`flex flex-col items-center transition-colors
              ${
                isActive("/dashboard")
                  ? "text-white"
                  : "text-zinc-300 hover:text-white"
              }`}
          >
            <div
              className={`p-1.5 rounded-full ${
                isActive("/dashboard") ? "bg-zinc-800" : ""
              }`}
            >
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
