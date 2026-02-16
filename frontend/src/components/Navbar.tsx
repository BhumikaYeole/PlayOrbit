import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Menu, X, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard } from "lucide-react";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/discover", label: "Discover Turfs" },
  { path: "/find-players", label: "Find Players" },
];

const Navbar = () => {
  const location = useLocation();
  const { user, logout, pendingRequests } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide nav links on landing page
  const isLanding = location.pathname === "/landing";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <Zap className="h-6 w-6 text-primary group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.8)] transition-all" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Play<span className="text-primary">Orbit</span>
          </span>
        </Link>

        {!isLanding && (
          <>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-md ${location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-bold text-foreground leading-none">{user.name}</p>
                    <p className="text-[10px] text-primary uppercase tracking-tighter">{user.role}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                      <Avatar className="h-9 w-9 border border-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 glass-strong border-border mt-2" align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {user.role === "Provider" && (
                        <Link to="/provider/dashboard">
                          <DropdownMenuItem className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            {pendingRequests.length > 0 && (
                              <span className="ml-auto bg-primary text-[8px] font-black text-black px-1.5 py-0.5 rounded-full">
                                {pendingRequests.length}
                              </span>
                            )}
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <Link to="/profile">
                        <DropdownMenuItem className="cursor-pointer">
                          <UserIcon className="mr-2 h-4 w-4" /> Profile
                          {user.role === "Player" && pendingRequests.length > 0 && (
                            <span className="ml-auto bg-amber-500 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full animate-pulse">
                              {pendingRequests.length}
                            </span>
                          )}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Link
                  to="/landing"
                  className="px-4 py-2 text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-lg transition-all hover:neon-border"
                >
                  Join Community
                </Link>
              )}
            </div>

            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>

      {mobileOpen && !isLanding && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass-strong border-t border-border"
        >
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === item.path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive active:bg-destructive/10"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
