import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  Target, 
  Clock, 
  Zap, 
  Trophy, 
  Heart,
  MapPin,
  TrendingUp,
  Award
} from 'lucide-react';

interface RunStats {
  distance: number;
  time: string;
  pace: string;
  calories: number;
  heartRate: number;
  territoryCaptured: number;
  totalTerritories: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
}

const RunDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [runTime, setRunTime] = useState(0);
  const [conquestProgress, setConquestProgress] = useState(0);

  const [runStats, setRunStats] = useState<RunStats>({
    distance: 0,
    time: '00:00:00',
    pace: '0:00',
    calories: 0,
    heartRate: 0,
    territoryCaptured: 0,
    totalTerritories: 12,
  });

  const achievements: Achievement[] = [
    { id: '1', title: 'First Territory', description: 'Claim your first territory', icon: '🏆', earned: true },
    { id: '2', title: 'Territory Defender', description: 'Successfully defend 5 territories', icon: '🛡️', earned: true, progress: 5 },
    { id: '3', title: 'Speed Conqueror', description: 'Capture a territory in under 10 minutes', icon: '⚡', earned: false, progress: 7 },
    { id: '4', title: 'Marathon Runner', description: 'Run 42.2km in a single session', icon: '🏃', earned: false, progress: 15.3 },
  ];

  // Simulate run timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setRunTime(prev => prev + 1);
        // Simulate stats update
        setRunStats(prev => ({
          ...prev,
          distance: Number((prev.distance + 0.002).toFixed(3)),
          time: formatTime(runTime + 1),
          pace: calculatePace(prev.distance + 0.002, runTime + 1),
          calories: Math.floor((runTime + 1) * 0.15),
          heartRate: 120 + Math.floor(Math.random() * 40),
        }));
        
        // Simulate territory conquest progress
        if (Math.random() > 0.95) {
          setConquestProgress(prev => Math.min(prev + 5, 100));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, runTime]);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = (distance: number, seconds: number): string => {
    if (distance === 0) return '0:00';
    const paceInSeconds = seconds / distance;
    const mins = Math.floor(paceInSeconds / 60);
    const secs = Math.floor(paceInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startRun = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const pauseRun = () => {
    setIsPaused(!isPaused);
  };

  const stopRun = () => {
    setIsRunning(false);
    setIsPaused(false);
    setRunTime(0);
    setConquestProgress(0);
    setRunStats({
      distance: 0,
      time: '00:00:00',
      pace: '0:00',
      calories: 0,
      heartRate: 0,
      territoryCaptured: 0,
      totalTerritories: 12,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Run Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Track your conquests in real-time</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className="badge-achievement">
              Level 12 Conqueror
            </Badge>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Current Streak</div>
              <div className="text-xl font-bold text-accent">7 days</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="stat-card text-center">
                <div className="metric-number">{runStats.distance.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground">KM</div>
              </Card>
              
              <Card className="stat-card text-center">
                <div className="metric-number">{runStats.time}</div>
                <div className="text-sm text-muted-foreground">TIME</div>
              </Card>
              
              <Card className="stat-card text-center">
                <div className="metric-number">{runStats.pace}</div>
                <div className="text-sm text-muted-foreground">PACE/KM</div>
              </Card>
              
              <Card className="stat-card text-center">
                <div className="metric-number">{runStats.calories}</div>
                <div className="text-sm text-muted-foreground">CALORIES</div>
              </Card>
            </div>

            {/* Territory Conquest Progress */}
            <Card className="card-game p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Territory Conquest
                </h3>
                <Badge variant={conquestProgress === 100 ? "default" : "secondary"}>
                  {conquestProgress === 100 ? "CONQUERED!" : "IN PROGRESS"}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Rajbada Circuit - Central Area</span>
                  <span>{conquestProgress}% Complete</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={conquestProgress} 
                    className="h-4 bg-muted"
                  />
                  <div 
                    className="absolute top-0 left-0 h-4 progress-conquest rounded-full transition-all duration-500"
                    style={{ width: `${conquestProgress}%` }}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">2.1 KM</div>
                    <div className="text-muted-foreground">Circuit Length</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-warning">1.8 KM</div>
                    <div className="text-muted-foreground">Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-accent">0.3 KM</div>
                    <div className="text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Control Panel */}
            <Card className="card-game p-6">
              <div className="flex justify-center gap-4">
                {!isRunning ? (
                  <Button 
                    onClick={startRun}
                    className="btn-conquest text-xl px-8 py-4"
                    size="lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Start Conquest
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={pauseRun}
                      variant="outline"
                      size="lg"
                      className="px-8 py-4"
                    >
                      {isPaused ? (
                        <><Play className="w-5 h-5 mr-2" />Resume</>
                      ) : (
                        <><Pause className="w-5 h-5 mr-2" />Pause</>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={stopRun}
                      variant="destructive"
                      size="lg"
                      className="px-8 py-4"
                    >
                      <Square className="w-5 h-5 mr-2" />
                      End Run
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Stats */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-destructive animate-pulse" />
                Live Metrics
              </h3>
              <div className="space-y-4">
                <div className="stat-card">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Heart Rate
                    </span>
                    <span className="metric-number text-lg">{runStats.heartRate}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">BPM</div>
                </div>
                
                <div className="stat-card">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Elevation
                    </span>
                    <span className="metric-number text-lg">+24m</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Gain</div>
                </div>
                
                <div className="stat-card">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </span>
                    <span className="text-sm font-semibold">Indore</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">MP, India</div>
                </div>
              </div>
            </Card>

            {/* Achievements */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-3 rounded-lg border transition-all ${
                      achievement.earned 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-border bg-muted/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <div className={`font-semibold text-sm ${achievement.earned ? 'text-primary' : ''}`}>
                          {achievement.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {achievement.description}
                        </div>
                        {achievement.progress && !achievement.earned && (
                          <div className="mt-2">
                            <Progress 
                              value={(achievement.progress / (achievement.id === '4' ? 42.2 : 10)) * 100} 
                              className="h-1"
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {achievement.progress}/{achievement.id === '4' ? '42.2 km' : '10 min'}
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.earned && (
                        <Trophy className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Territory Status */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Territory Status
              </h3>
              <div className="space-y-3">
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owned</span>
                    <span className="metric-number text-lg">{runStats.totalTerritories}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Under Attack</span>
                    <span className="text-lg font-bold text-destructive">2</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capturing</span>
                    <span className="text-lg font-bold text-warning">1</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDashboard;