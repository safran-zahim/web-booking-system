import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Booking, Court } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CalendarCheck, Users } from 'lucide-react';

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [courts, setCourts] = useState<Court[]>([]);

    useEffect(() => {
        // Fetch data in parallel
        Promise.all([api.getBookings(), api.getCourts()]).then(([bData, cData]) => {
            setBookings(bData);
            setCourts(cData);
        });
    }, []);

    const handleCancel = (id: string) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            api.cancelBooking(id).then(() => {
                // Refresh local state
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' } : b)); // NOTE: In a real app we would set to canceled, but for mock purposes we might just want to toggle or set to canceled. The user request said status: 'canceled'.
                setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'canceled' } : b));
            });
        }
    };

    // Simple Stats Calculation
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((acc, curr) => {
            const court = courts.find(c => c.id === curr.courtId);
            return acc + (court ? court.pricePerHour : 0);
        }, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bookings.filter(b => b.status === 'confirmed').length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{courts.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Court</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {bookings.map((booking) => {
                                const courtName = courts.find(c => c.id === booking.courtId)?.name || 'Unknown';
                                return (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">{booking.userName}</TableCell>
                                        <TableCell>{booking.date}</TableCell>
                                        <TableCell>{booking.startTime} - {booking.endTime}</TableCell>
                                        <TableCell>{courtName}</TableCell>
                                        <TableCell>
                                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'destructive'}>
                                                {booking.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {booking.status === 'confirmed' && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleCancel(booking.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
