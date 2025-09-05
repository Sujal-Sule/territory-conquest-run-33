import React, { useEffect, useState } from 'react';
import { useGoogleMaps, useGeolocation } from '@/hooks/useGoogleMaps';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Play, Square, Target, Zap } from 'lucide-react';

interface Territory {
  id: string;
  owner: string;
  type: 'user' | 'enemy' | 'ally' | 'neutral' | 'contested';
  coordinates: Array<{ lat: number; lng: number }>;
  lastActivity: string;
  strength: number;
}

interface RunPath {
  coordinates: Array<{ lat: number; lng: number; timestamp: number }>;
  distance: number;
  isActive: boolean;
}

const GoogleMapComponent = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [runPath, setRunPath] = useState<RunPath>({ coordinates: [], distance: 0, isActive: false });
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [activeTerritory, setActiveTerritory] = useState<Territory | null>(null);

  // Initialize map centered on Indore, MP
  const indoreLocation = { lat: 22.7196, lng: 75.8577 };
  const { map, isLoaded, mapRef } = useGoogleMaps({
    center: indoreLocation,
    zoom: 13,
    containerId: 'google-map'
  });

  const { location, isTracking, startTracking, stopTracking } = useGeolocation();

  // Mock territories data for Indore
  useEffect(() => {
    const mockTerritories: Territory[] = [
      {
        id: '1',
        owner: 'You',
        type: 'user',
        coordinates: [
          { lat: 22.7196, lng: 75.8577 },
          { lat: 22.7200, lng: 75.8580 },
          { lat: 22.7198, lng: 75.8585 },
          { lat: 22.7194, lng: 75.8582 }
        ],
        lastActivity: '2 hours ago',
        strength: 85
      },
      {
        id: '2',
        owner: 'Runner42',
        type: 'enemy',
        coordinates: [
          { lat: 22.7180, lng: 75.8590 },
          { lat: 22.7185, lng: 75.8595 },
          { lat: 22.7182, lng: 75.8600 },
          { lat: 22.7177, lng: 75.8597 }
        ],
        lastActivity: '30 min ago',
        strength: 72
      },
      {
        id: '3',
        owner: 'Unclaimed',
        type: 'neutral',
        coordinates: [
          { lat: 22.7210, lng: 75.8560 },
          { lat: 22.7215, lng: 75.8565 },
          { lat: 22.7212, lng: 75.8570 },
          { lat: 22.7207, lng: 75.8567 }
        ],
        lastActivity: 'Never',
        strength: 0
      }
    ];
    setTerritories(mockTerritories);
  }, []);

  // Draw territories on map
  useEffect(() => {
    if (!map || !window.google || territories.length === 0) return;

    territories.forEach(territory => {
      const territoryPath = territory.coordinates.map(coord => 
        new window.google.maps.LatLng(coord.lat, coord.lng)
      );

      const territoryPolygon = new window.google.maps.Polygon({
        paths: territoryPath,
        strokeColor: getTerritoryColor(territory.type),
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: getTerritoryColor(territory.type),
        fillOpacity: territory.type === 'contested' ? 0.5 : 0.3,
        map: map
      });

      territoryPolygon.addListener('click', () => {
        setActiveTerritory(territory);
      });

      // Add pulsing effect for contested territories
      if (territory.type === 'contested') {
        let opacity = 0.3;
        let increasing = true;
        setInterval(() => {
          opacity += increasing ? 0.05 : -0.05;
          if (opacity >= 0.6) increasing = false;
          if (opacity <= 0.2) increasing = true;
          territoryPolygon.setOptions({ fillOpacity: opacity });
        }, 200);
      }
    });
  }, [map, territories]);

  // Track running path
  useEffect(() => {
    if (!map || !location || !isRunning) return;

    const newCoordinate = {
      lat: location.lat,
      lng: location.lng,
      timestamp: Date.now()
    };

    setRunPath(prev => {
      const newPath = { ...prev };
      newPath.coordinates.push(newCoordinate);
      
      // Calculate distance if we have at least 2 points
      if (newPath.coordinates.length > 1) {
        const lastCoord = newPath.coordinates[newPath.coordinates.length - 2];
        const distance = calculateDistance(
          lastCoord.lat, lastCoord.lng,
          newCoordinate.lat, newCoordinate.lng
        );
        newPath.distance += distance;
      }

      return newPath;
    });

    // Draw path on map
    if (runPath.coordinates.length > 1) {
      const pathCoordinates = runPath.coordinates.map(coord => 
        new window.google.maps.LatLng(coord.lat, coord.lng)
      );

      new window.google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#3B82F6',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map: map
      });
    }

    // Center map on current location
    map.setCenter(new window.google.maps.LatLng(location.lat, location.lng));
  }, [location, isRunning, map]);

  const getTerritoryColor = (type: Territory['type']) => {
    switch (type) {
      case 'user': return '#3B82F6';
      case 'enemy': return '#EF4444';
      case 'ally': return '#10B981';
      case 'contested': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const startRun = () => {
    setIsRunning(true);
    setRunPath({ coordinates: [], distance: 0, isActive: true });
    startTracking();
  };

  const stopRun = () => {
    setIsRunning(false);
    stopTracking();
    setRunPath(prev => ({ ...prev, isActive: false }));
    
    // Check if run creates a territory (closed loop)
    checkForTerritoryCreation();
  };

  const checkForTerritoryCreation = () => {
    if (runPath.coordinates.length < 4) return;

    const firstPoint = runPath.coordinates[0];
    const lastPoint = runPath.coordinates[runPath.coordinates.length - 1];
    
    // Check if start and end points are close (within 50 meters)
    const distance = calculateDistance(
      firstPoint.lat, firstPoint.lng,
      lastPoint.lat, lastPoint.lng
    );

    if (distance < 0.05) { // 50 meters
      // Create new territory
      const newTerritory: Territory = {
        id: Date.now().toString(),
        owner: 'You',
        type: 'user',
        coordinates: runPath.coordinates.map(coord => ({ lat: coord.lat, lng: coord.lng })),
        lastActivity: 'Just now',
        strength: 100
      };
      
      setTerritories(prev => [...prev, newTerritory]);
    }
  };

  const getTerritoryIcon = (type: Territory['type']) => {
    switch (type) {
      case 'user': return '🏆';
      case 'enemy': return '⚔️';
      case 'ally': return '🤝';
      case 'contested': return '💥';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Live Territory Map
            </h1>
            <p className="text-muted-foreground mt-2">Indore, Madhya Pradesh - Real-time GPS tracking</p>
          </div>
          
          <div className="flex gap-4">
            <Button 
              variant={isRunning ? "destructive" : "default"}
              onClick={isRunning ? stopRun : startRun}
              className={isRunning ? "btn-battle" : "btn-conquest"}
              disabled={!isLoaded}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Stop Run
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Run
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <Card className="card-game p-6">
              <div className="relative">
                <div
                  ref={mapRef}
                  id="google-map"
                  className="w-full h-96 rounded-xl map-container"
                />
                
                {!isLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/20 rounded-xl">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                      <p className="text-muted-foreground">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Run Stats */}
              {isRunning && (
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--gradient-card)' }}>
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                    Live Run
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="stat-card text-center">
                      <div className="metric-number">{runPath.distance.toFixed(2)} km</div>
                      <div className="text-sm text-muted-foreground">Distance</div>
                    </div>
                    <div className="stat-card text-center">
                      <div className="metric-number">{runPath.coordinates.length}</div>
                      <div className="text-sm text-muted-foreground">Points</div>
                    </div>
                    <div className="stat-card text-center">
                      <div className="metric-number">{isTracking ? 'Active' : 'Paused'}</div>
                      <div className="text-sm text-muted-foreground">GPS Status</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Territory Details */}
              {activeTerritory && (
                <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--gradient-card)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{getTerritoryIcon(activeTerritory.type)}</span>
                      Territory #{activeTerritory.id}
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
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Location */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                GPS Status
              </h3>
              <div className="space-y-3">
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`font-semibold ${isTracking ? 'text-success' : 'text-warning'}`}>
                      {isTracking ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                {location && (
                  <>
                    <div className="stat-card">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latitude</span>
                        <span className="font-mono text-sm">{location.lat.toFixed(6)}</span>
                      </div>
                    </div>
                    <div className="stat-card">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Longitude</span>
                        <span className="font-mono text-sm">{location.lng.toFixed(6)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Territory Count */}
            <Card className="card-game p-6">
              <h3 className="text-xl font-bold mb-4">Territory Summary</h3>
              <div className="space-y-3">
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Territories</span>
                    <span className="metric-number">
                      {territories.filter(t => t.type === 'user').length}
                    </span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enemy Territories</span>
                    <span className="text-destructive font-semibold">
                      {territories.filter(t => t.type === 'enemy').length}
                    </span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className="text-muted-foreground">
                      {territories.filter(t => t.type === 'neutral').length}
                    </span>
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

export default GoogleMapComponent;