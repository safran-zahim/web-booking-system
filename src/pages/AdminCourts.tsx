import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Court, Sport } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminCourts() {
    const { toast } = useToast();
    const [courts, setCourts] = useState<Court[]>([]);
    const [sports, setSports] = useState<Sport[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form State
    const [newCourt, setNewCourt] = useState({ name: '', sportId: '', type: '', price: '' });

    useEffect(() => {
        api.getCourts().then(setCourts);
        api.getSports().then(setSports);
    }, []);

    const handleAddCourt = () => {
        if (!newCourt.name || !newCourt.sportId || !newCourt.price) return;

        const courtData: Court = {
            id: Math.random().toString(36).substr(2, 9),
            name: newCourt.name,
            sportId: newCourt.sportId,
            type: newCourt.type || 'Standard',
            pricePerHour: parseFloat(newCourt.price),
        };

        // Update local state (in a real app, you'd call api.createCourt)
        setCourts([...courts, courtData]);
        setIsDialogOpen(false);
        setNewCourt({ name: '', sportId: '', type: '', price: '' });

        toast({ title: "Court Added", description: `${courtData.name} is now available.` });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Courts</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> Add New Court</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Court</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Court Name</Label>
                                <Input
                                    id="name"
                                    value={newCourt.name}
                                    onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })}
                                    placeholder="e.g., Badminton Court 3"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sport">Sport</Label>
                                <Select onValueChange={(val) => setNewCourt({ ...newCourt, sportId: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select sport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sports.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type (Optional)</Label>
                                <Input
                                    id="type"
                                    value={newCourt.type}
                                    onChange={(e) => setNewCourt({ ...newCourt, type: e.target.value })}
                                    placeholder="e.g., Indoor / Clay"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="price">Hourly Rate ($)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={newCourt.price}
                                    onChange={(e) => setNewCourt({ ...newCourt, price: e.target.value })}
                                    placeholder="20"
                                />
                            </div>
                            <Button onClick={handleAddCourt}>Save Court</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Sport</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Price/Hr</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courts.map((court) => (
                            <TableRow key={court.id}>
                                <TableCell className="font-medium">{court.name}</TableCell>
                                <TableCell>{sports.find(s => s.id === court.sportId)?.name}</TableCell>
                                <TableCell>{court.type}</TableCell>
                                <TableCell>${court.pricePerHour}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
