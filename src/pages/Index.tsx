import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import TerritoryMap from '@/components/TerritoryMap';
import RunDashboard from '@/components/RunDashboard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Users, 
  Target, 
  Crown,
  Medal,
  Zap,
  MapPin
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('map');

  // Mock leaderboard data
  const leaderboardData = [
    { rank: 1, name: 'shivam', territories: 12, battles: 28, level: 12, avatar: '👤', points: 2840 },
    { rank: 2, name: 'Runner42', territories: 8, battles: 15, level: 9, avatar: '🏃', points: 1950 },
    { rank: 3, name: 'FitnessCrew', territories: 6, battles: 22, level: 11, avatar: '💪', points: 1820 },
    { rank: 4, name: 'SpeedDemon', territories: 5, battles: 31, level: 8, avatar: '⚡', points: 1650 },
    { rank: 5, name: 'CityConqueror', territories: 4, battles: 12, level: 7, avatar: '🏆', points: 1320 },
  ];

  const userProfile = {
    name: 'Alex Runner',
    level: 12,
    totalRuns: 127,
    totalDistance: 542.8,
    territoriesOwned: 12,
    battlesWon: 28,
    currentStreak: 7,
    achievements: [
      { title: 'First Territory', icon: '🏆', earned: true },
      { title: 'Speed Demon', icon: '⚡', earned: true },
      { title: 'Territory Defender', icon: '🛡️', earned: true },
      { title: 'Marathon Master', icon: '🏃', earned: false },
    ]
  };

  const renderLeaderboard = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-muted-foreground mt-2">Indore Territory Champions</p>
          </div>
          <Badge className="badge-achievement">
            Global Rank: #47
          </Badge>
        </div>

        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <Card key={player.rank} className="card-game p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                    'bg-gradient-to-br from-muted to-muted-foreground'
                  }`}>
                    {index < 3 ? (index === 0 ? '👑' : index === 1 ? '🥈' : '🥉') : player.avatar}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{player.name}</span>
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-500" />}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Level {player.level} • {player.battles} battles won
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">#{player.rank}</div>
                  <div className="text-sm text-muted-foreground">{player.points} pts</div>
                </div>

                <div className="grid grid-cols-2 gap-4 ml-8">
                  <div className="text-center">
                    <div className="font-bold text-primary">{player.territories}</div>
                    <div className="text-xs text-muted-foreground">Territories</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-accent">{player.battles}</div>
                    <div className="text-xs text-muted-foreground">Victories</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-muted-foreground mt-2">Your conquest statistics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <Card className="card-game p-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  AR
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold">{userProfile.name}</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge className="badge-achievement">Level {userProfile.level}</Badge>
                    <Badge variant="outline">🔥 {userProfile.currentStreak} day streak</Badge>
                    <Badge variant="outline">🏆 #1 Local</Badge>
                  </div>
                </div>
                <Button className="btn-conquest">
                  <Zap className="w-4 h-4 mr-2" />
                  Start Run
                </Button>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="lg:col-span-2">
            <Card className="card-game p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="stat-card text-center">
                  <div className="metric-number">{userProfile.totalRuns}</div>
                  <div className="text-sm text-muted-foreground">Total Runs</div>
                </div>
                <div className="stat-card text-center">
                  <div className="metric-number">{userProfile.totalDistance}</div>
                  <div className="text-sm text-muted-foreground">KM Covered</div>
                </div>
                <div className="stat-card text-center">
                  <div className="metric-number">{userProfile.territoriesOwned}</div>
                  <div className="text-sm text-muted-foreground">Territories</div>
                </div>
                <div className="stat-card text-center">
                  <div className="metric-number">{userProfile.battlesWon}</div>
                  <div className="text-sm text-muted-foreground">Battles Won</div>
                </div>
              </div>
            </Card>

            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="leaderboard-rank">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-semibold">Conquered AB Road Track</div>
                      <div className="text-sm text-muted-foreground">2 hours ago</div>
                    </div>
                  </div>
                  <Badge className="badge-achievement">+50 pts</Badge>
                </div>
                <div className="leaderboard-rank">
                  <div className="flex items-center gap-3">
                    <Medal className="w-5 h-5 text-accent" />
                    <div>
                      <div className="font-semibold">Defended Nehru Park</div>
                      <div className="text-sm text-muted-foreground">1 day ago</div>
                    </div>
                  </div>
                  <Badge variant="outline">+25 pts</Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4">Achievements</h3>
              <div className="space-y-3">
                {userProfile.achievements.map((achievement, index) => (
                  <div 
                    key={index}
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
                      </div>
                      {achievement.earned && (
                        <Trophy className="w-4 h-4 text-accent" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-2">Customize your conquest experience</p>
        </div>

        <div className="space-y-6">
          <Card className="card-game p-6">
            <h3 className="text-xl font-bold mb-4">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Territory attacks</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Daily challenges</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Leaderboard updates</span>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
            </div>
          </Card>

          <Card className="card-game p-6">
            <h3 className="text-xl font-bold mb-4">Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Share location data</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Public profile</span>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </div>
          </Card>

          <Card className="card-game p-6">
            <h3 className="text-xl font-bold mb-4">Connected Devices</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Fitness tracker</span>
                <Button className="btn-conquest" size="sm">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <span>Heart rate monitor</span>
                <Button className="btn-conquest" size="sm">Connect</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <TerritoryMap />;
      case 'dashboard':
        return <RunDashboard />;
      case 'leaderboard':
        return renderLeaderboard();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return <TerritoryMap />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
};

export default Index;
