import { Link, useLocation } from 'react-router-dom';
import { Trophy, LayoutDashboard, CalendarDays, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <nav className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Trophy className="h-6 w-6 text-orange-500" />
                    <span>SportBooker</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {!isAdmin ? (
                        <>
                            <Link to="/book" className="text-sm font-medium hover:text-orange-500 transition-colors">
                                Book a Court
                            </Link>
                            <Link to="/my-bookings" className="text-sm font-medium hover:text-orange-500 transition-colors">
                                My Bookings
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/admin" className="text-sm font-medium hover:text-blue-600 transition-colors">
                                Dashboard
                            </Link>
                            <Link to="/admin/courts" className="text-sm font-medium hover:text-blue-600 transition-colors">
                                Manage Courts
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {isAdmin ? (
                        <Link to="/">
                            <Button variant="outline" size="sm" className="gap-2">
                                <User className="h-4 w-4" /> Switch to User
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/admin">
                            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                                <LayoutDashboard className="h-4 w-4" /> Admin View
                            </Button>
                        </Link>
                    )}

                    {!isAdmin && (
                        <Link to="/book">
                            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                                Book Now <CalendarDays className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
