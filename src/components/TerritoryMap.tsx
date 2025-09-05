import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target, Trophy, Users, Clock, Zap, Navigation } from 'lucide-react';
import GoogleMapComponent from './GoogleMapComponent';

interface Territory {
  id: string;
  owner: string;
  type: 'user' | 'enemy' | 'ally' | 'neutral' | 'contested';
  area: string;
  lastActivity: string;
  strength: number;
}

interface Player {
  id: string;
  name: string;
  territories: number;
  rank: number;
  avatar: string;
}

const TerritoryMap = () => {
  const [activeTerritory, setActiveTerritory] = useState<Territory | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(false);

  // Mock data for demonstration
  const territories: Territory[] = [
    { id: '1', owner: 'You', type: 'user', area: 'Central Park North', lastActivity: '2 hours ago', strength: 85 },
    { id: '2', owner: 'Runner42', type: 'enemy', area: 'AB Road Track', lastActivity: '30 min ago', strength: 72 },
    { id: '3', owner: 'FitnessCrew', type: 'ally', area: 'Nehru Park Loop', lastActivity: '1 hour ago', strength: 91 },
    { id: '4', owner: 'Unclaimed', type: 'neutral', area: 'Sadar Manzil Grounds', lastActivity: 'Never', strength: 0 },
    { id: '5', owner: 'SpeedDemon vs You', type: 'contested', area: 'Rajbada Circuit', lastActivity: 'Live', strength: 67 },
  ];

  const topPlayers: Player[] = [
    { id: '1', name: 'You', territories: 12, rank: 1, avatar: '👤' },
    { id: '2', name: 'Runner42', territories: 8, rank: 2, avatar: '🏃' },
    { id: '3', name: 'FitnessCrew', territories: 6, rank: 3, avatar: '💪' },
    { id: '4', name: 'SpeedDemon', territories: 5, rank: 4, avatar: '⚡' },
  ];

  const getTerritoryIcon = (type: Territory['type']) => {
    switch (type) {
      case 'user': return '🏆';
      case 'enemy': return '⚔️';
      case 'ally': return '🤝';
      case 'contested': return '💥';
      default: return '❓';
    }
  };

  const getTerritoryClass = (type: Territory['type']) => {
    switch (type) {
      case 'user': return 'territory-user';
      case 'enemy': return 'territory-enemy';
      case 'ally': return 'bg-gradient-to-br from-territory-ally to-green-400';
      case 'contested': return 'territory-contested animate-battle-pulse';
      default: return 'territory-neutral';
    }
  };

  if (useGoogleMaps) {
    return <GoogleMapComponent />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Territory Map
            </h1>
            <p className="text-muted-foreground mt-2">Indore, Madhya Pradesh - Battle for your running grounds</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => setUseGoogleMaps(!useGoogleMaps)}
              className="btn-conquest"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {useGoogleMaps ? 'Demo Map' : 'Google Maps'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="btn-conquest"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Leaderboard
            </Button>
            <Button className="btn-battle">
              <Target className="w-4 h-4 mr-2" />
              Start Run
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map Area */}
          <div className="lg:col-span-2">
            <Card className="card-game p-6">
              <div className="map-container h-96 bg-gradient-to-br from-muted/20 to-muted/40 flex items-center justify-center relative overflow-hidden">
                {/* Simulated map with territories */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-4 grid-rows-4 h-full gap-1 p-4">
                    {territories.map((territory, index) => (
                      <div
                        key={territory.id}
                        className={`${getTerritoryClass(territory.type)} rounded-lg cursor-pointer transition-all hover:scale-105 flex items-center justify-center text-2xl`}
                        onClick={() => setActiveTerritory(territory)}
                        style={{
                          gridColumn: `${(index % 4) + 1}`,
                          gridRow: `${Math.floor(index / 4) + 1}`,
                        }}
                      >
                        {getTerritoryIcon(territory.type)}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Map overlay content */}
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                  <h3 className="text-2xl font-bold mb-2">Indore Territory Map</h3>
                  <p className="text-muted-foreground">Click on territories to view details</p>
                </div>
              </div>

              {/* Territory Details */}
              {activeTerritory && (
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--gradient-card)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{getTerritoryIcon(activeTerritory.type)}</span>
                      {activeTerritory.area}
                    </h4>
                    <Badge className="badge-achievement">
                      {activeTerritory.type.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat-card text-center">
                      <div className="metric-number">{activeTerritory.strength}%</div>
                      <div className="text-sm text-muted-foreground">Control</div>
                    </div>
                    <div className="stat-card text-center">
                      <div className="metric-number">{activeTerritory.owner}</div>
                      <div className="text-sm text-muted-foreground">Owner</div>
                    </div>
                    <div className="stat-card text-center">
                      <div className="metric-number">{activeTerritory.lastActivity}</div>
                      <div className="text-sm text-muted-foreground">Last Activity</div>
                    </div>
                  </div>

                  {activeTerritory.type === 'contested' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Battle Progress</span>
                        <span>{activeTerritory.strength}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <div 
                          className="progress-conquest animate-conquest"
                          style={{ width: `${activeTerritory.strength}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {activeTerritory.type === 'neutral' && (
                      <Button className="btn-conquest flex-1">
                        <Zap className="w-4 h-4 mr-2" />
                        Claim Territory
                      </Button>
                    )}
                    {activeTerritory.type === 'enemy' && (
                      <Button className="btn-battle flex-1">
                        <Target className="w-4 h-4 mr-2" />
                        Attack Territory
                      </Button>
                    )}
                    {activeTerritory.type === 'user' && (
                      <Button variant="outline" className="flex-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        View Stats
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Your Empire
              </h3>
              <div className="space-y-4">
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Territories</span>
                    <span className="metric-number">12</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rank</span>
                    <span className="metric-number">#1</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Battles Won</span>
                    <span className="metric-number">28</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Top Competitors */}
            {showLeaderboard && (
              <Card className="card-game p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-accent" />
                  Local Leaders
                </h3>
                <div className="space-y-3">
                  {topPlayers.map((player) => (
                    <div key={player.id} className="leaderboard-rank">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{player.avatar}</span>
                        <div>
                          <div className="font-semibold">{player.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {player.territories} territories
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">#{player.rank}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Active Battles */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning animate-pulse" />
                Live Battles
              </h3>
              <div className="space-y-3">
                {territories.filter(t => t.type === 'contested').map((battle) => (
                  <div key={battle.id} className="p-3 rounded-lg border border-warning/30 bg-warning/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-sm">{battle.area}</span>
                      <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{battle.owner}</div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="progress-conquest h-2"
                        style={{ width: `${battle.strength}%` }}
                      />
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
};

export default TerritoryMap;