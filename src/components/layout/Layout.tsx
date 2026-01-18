import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from '@/components/ui/toaster';

export function Layout() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {/* Outlet renders the current page based on the route */}
                <Outlet />
            </main>
            <Toaster />
        </div>
    );
}
