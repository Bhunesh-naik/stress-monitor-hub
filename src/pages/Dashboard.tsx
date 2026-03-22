import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sensorService, type SensorData } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Heart, Zap, Brain, History, Send, Play } from 'lucide-react';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [form, setForm] = useState({ heartRate: '', gsrValue: '' });
  const [starting, setStarting] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sensorService.postData({
        heartRate: Number(form.heartRate),
        gsrValue: Number(form.gsrValue),
        stressLevel: '',
      });
      setSensorData(res.data);
      toast({ title: 'Data submitted', description: 'Sensor data recorded successfully.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to submit sensor data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setStarting(true);
    try {
      await sensorService.start();
      toast({ title: 'Sensor Started', description: 'Hardware is now taking readings.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to start sensor.', variant: 'destructive' });
    } finally {
      setStarting(false);
    }
  };

  const isHigh = sensorData?.stressLevel === 'HIGH';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Real-time stress monitoring overview</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleStart} disabled={starting} variant="default">
            <Play className="mr-2 h-4 w-4" /> {starting ? 'Starting...' : 'Start Sensor'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/history')}>
            <History className="mr-2 h-4 w-4" /> View History
          </Button>
        </div>
      </div>

      {/* Sensor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Heart Rate</CardTitle>
            <Heart className="h-5 w-5 text-destructive" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{sensorData?.heartRate ?? '--'}</p>
            <p className="text-xs text-muted-foreground mt-1">BPM</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">GSR Value</CardTitle>
            <Zap className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-foreground">{sensorData?.gsrValue ?? '--'}</p>
            <p className="text-xs text-muted-foreground mt-1">Galvanic Skin Response</p>
          </CardContent>
        </Card>

        <Card className={`border-border/50 shadow-md ${isHigh ? 'ring-2 ring-destructive/50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stress Level</CardTitle>
            <Brain className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {sensorData ? (
              <Badge className={isHigh
                ? 'bg-destructive text-destructive-foreground text-lg px-4 py-1'
                : 'bg-[hsl(142,71%,45%)] text-[hsl(0,0%,100%)] text-lg px-4 py-1'}>
                {sensorData.stressLevel}
              </Badge>
            ) : (
              <p className="text-4xl font-bold text-foreground">--</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {isHigh ? '⚠ Elevated stress detected' : 'Current status'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Submit Sensor Data */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Submit Sensor Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="heartRate">Heart Rate</Label>
              <Input id="heartRate" type="number" placeholder="e.g. 102" value={form.heartRate} onChange={update('heartRate')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gsrValue">GSR Value</Label>
              <Input id="gsrValue" type="number" placeholder="e.g. 650" value={form.gsrValue} onChange={update('gsrValue')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stressLevel">Stress Level</Label>
              <select
                id="stressLevel"
                value={form.stressLevel}
                onChange={update('stressLevel')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              <Send className="mr-2 h-4 w-4" /> {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
