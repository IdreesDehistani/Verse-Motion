import { useState } from 'react';
import { Music, Edit2, Camera, Palette, Star, Heart, Disc3, Headphones, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { SpotlightEffect } from '@/components/SpotlightEffect';

interface SongInfoProps {
  title?: string;
  artist?: string;
  album?: string;
  albumCover?: string;
  onAlbumCoverChange?: (cover: string) => void;
  onSongInfoChange?: (field: 'title' | 'artist' | 'album', value: string) => void;
}

export function SongInfo({ title, artist, album, albumCover, onAlbumCoverChange, onSongInfoChange }: SongInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string>('Music');
  const [selectedColor, setSelectedColor] = useState<string>('hsl(var(--primary))');
  const [editingField, setEditingField] = useState<'title' | 'artist' | 'album' | null>(null);
  const [editValue, setEditValue] = useState('');

  const iconOptions = [
    { name: 'Music', icon: Music },
    { name: 'Disc3', icon: Disc3 },
    { name: 'Headphones', icon: Headphones },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart },
  ];

  const colorOptions = [
    { name: 'Primary', value: 'hsl(var(--primary))', color: 'var(--primary)' },
    { name: 'Dark Teal', value: 'hsl(174 80% 25%)', color: '174 80% 25%' },
    { name: 'Deep Red', value: 'hsl(0 70% 40%)', color: '0 70% 40%' },
    { name: 'Purple', value: 'hsl(281 70% 50%)', color: '281 70% 50%' },
    { name: 'Dark Blue', value: 'hsl(210 80% 35%)', color: '210 80% 35%' },
    { name: 'Forest', value: 'hsl(120 60% 30%)', color: '120 60% 30%' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAlbumCoverChange) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onAlbumCoverChange(e.target.result as string);
          setIsEditing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const applyIconAndColor = () => {
    if (onAlbumCoverChange) {
      onAlbumCoverChange(`icon:${selectedIcon}:${selectedColor}`);
      setIsEditing(false);
    }
  };

  const startEditing = (field: 'title' | 'artist' | 'album', currentValue?: string) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const saveEdit = () => {
    if (editingField && onSongInfoChange) {
      onSongInfoChange(editingField, editValue);
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  if (!title && !artist) {
    return null;
  }

  const renderAlbumCover = () => {
    if (albumCover) {
      if (albumCover.startsWith('icon:')) {
        const [, iconName, iconColor] = albumCover.split(':');
        const IconComponent = iconOptions.find(opt => opt.name === iconName)?.icon || Music;
        return (
          <div 
            className="w-36 h-36 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: iconColor }}
          >
            <IconComponent className="h-8 w-8 text-white" />
          </div>
        );
      } else {
        return (
          <img
            src={albumCover}
            alt={`${album || title} cover`}
            className="w-16 h-16 rounded-xl object-cover shadow-lg transition-all duration-300 hover:scale-105"
          />
        );
      }
    } else {
      return (
        <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105">
          <Music className="h-8 w-8 text-white" />
        </div>
      );
    }
  };

  return (
    <SpotlightEffect className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-card border border-border/50 animate-fade-in">
      <div className="flex items-center space-x-4 group">
        <div className="relative">
          {renderAlbumCover()}
          
          {onAlbumCoverChange && (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card/90 border-border/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-card/95 backdrop-blur-md border-border/50">
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-foreground">Customize Album Cover</h3>
                    
                    {/* Upload Image */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Upload Image</label>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="relative overflow-hidden">
                          <Camera className="w-4 h-4 mr-2" />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-4">
                      <label className="text-sm font-medium text-foreground mb-3 block">Or Choose Icon & Color</label>
                      
                      {/* Icon Selection */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Icon</label>
                        <div className="grid grid-cols-5 gap-2">
                          {iconOptions.map((option) => (
                            <button
                              key={option.name}
                              onClick={() => setSelectedIcon(option.name)}
                              className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                                selectedIcon === option.name ? 'border-primary bg-primary/10' : 'border-border/30 hover:border-border/60'
                              }`}
                            >
                              <option.icon className="w-5 h-5 mx-auto" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color Selection */}
                      <div className="mb-4">
                        <label className="text-xs text-muted-foreground mb-2 block">Background Color</label>
                        <div className="grid grid-cols-3 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setSelectedColor(color.value)}
                              className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                                selectedColor === color.value ? 'border-primary shadow-glow' : 'border-border/30'
                              }`}
                              style={{ 
                                backgroundColor: color.value === 'hsl(var(--primary))' 
                                  ? `hsl(${color.color})` 
                                  : color.value,
                                opacity: 0.8 
                              }}
                            >
                              <div className="w-full h-4 rounded-sm" />
                              <span className="text-xs text-foreground mt-1 block">{color.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <Button 
                        onClick={applyIconAndColor}
                        className="w-full bg-gradient-primary text-white"
                      >
                        <Palette className="w-4 h-4 mr-2" />
                        Apply Icon & Color
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title */}
          <div className="group flex items-center">
            {editingField === 'title' ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-input/50 border-border/50"
                  placeholder="Enter song title..."
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit} className="w-8 h-8 p-0">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit} className="w-8 h-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-foreground truncate transition-all duration-200 hover:scale-105 hover:text-primary cursor-default flex-1">
                  {title || 'Unknown Title'}
                </h2>
                {onSongInfoChange && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing('title', title)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 w-8 h-8 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Artist */}
          <div className="group flex items-center">
            {editingField === 'artist' ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-input/50 border-border/50"
                  placeholder="Enter artist name..."
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit} className="w-8 h-8 p-0">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit} className="w-8 h-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground truncate transition-all duration-200 hover:scale-105 hover:text-accent cursor-default flex-1">
                  {artist || 'Unknown Artist'}
                </p>
                {onSongInfoChange && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing('artist', artist)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 w-8 h-8 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Album */}
          <div className="group flex items-center">
            {editingField === 'album' ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 bg-input/50 border-border/50"
                  placeholder="Enter album name..."
                  autoFocus
                />
                <Button size="sm" onClick={saveEdit} className="w-8 h-8 p-0">
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={cancelEdit} className="w-8 h-8 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground/80 truncate transition-all duration-200 hover:scale-105 cursor-default flex-1">
                  {album || 'Unknown Album'}
                </p>
                {onSongInfoChange && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing('album', album)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 w-8 h-8 p-0"
                  >
                    <Edit2 className="w-3 h-3" />
                  </Button>
                )}
              </>
             )}
           </div>
        </div>
      </div>
    </SpotlightEffect>
  );
}