import { useState, useEffect } from 'react';
import { sensorService, type SensorData } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Database } from 'lucide-react';

const HistoryPage = () => {
  const [data, setData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    sensorService.getHistory()
      .then(res => setData(res.data))
      .catch(() => toast({ title: 'Error', description: 'Failed to load history.', variant: 'destructive' }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Sensor History</h1>
        <p className="text-muted-foreground">Previous stress monitoring readings</p>
      </div>

      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="h-5 w-5 text-primary" /> Readings Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : data.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No sensor data recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Heart Rate (BPM)</TableHead>
                  <TableHead>GSR Value</TableHead>
                  <TableHead>Stress Level</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.id}</TableCell>
                    <TableCell>{row.heartRate}</TableCell>
                    <TableCell>{row.gsrValue}</TableCell>
                    <TableCell>
                      <Badge className={row.stressLevel === 'HIGH'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-[hsl(142,71%,45%)] text-[hsl(0,0%,100%)]'}>
                        {row.stressLevel}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryPage;
