import { useState } from 'react';
import {
  Music, Edit2, Camera, Palette, Star, Heart,
  Disc3, Headphones, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover, PopoverContent, PopoverTrigger
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { SpotlightEffect } from '@/components/SpotlightEffect';

interface SongInfoProps {
  title?: string;
  artist?: string;
  album?: string;
  albumCover?: string;
  onAlbumCoverChange?: (cover: string) => void;
  onSongInfoChange?: (
    field: 'title' | 'artist' | 'album',
    value: string
  ) => void;
}

export function SongInfo({
  title,
  artist,
  album,
  albumCover,
  onAlbumCoverChange,
  onSongInfoChange
}: SongInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState('Music');
  const [selectedColor, setSelectedColor] = useState('hsl(var(--primary))');
  const [editingField, setEditingField] = useState<
    'title' | 'artist' | 'album' | null
  >(null);
  const [editValue, setEditValue] = useState('');

  const iconOptions = [
    { name: 'Music', icon: Music },
    { name: 'Disc3', icon: Disc3 },
    { name: 'Headphones', icon: Headphones },
    { name: 'Star', icon: Star },
    { name: 'Heart', icon: Heart }
  ];

  const colorOptions = [
    { name: 'Primary', value: 'hsl(var(--primary))' },
    { name: 'Dark Teal', value: 'hsl(174 80% 25%)' },
    { name: 'Deep Red', value: 'hsl(0 70% 40%)' },
    { name: 'Purple', value: 'hsl(281 70% 50%)' },
    { name: 'Dark Blue', value: 'hsl(210 80% 35%)' },
    { name: 'Forest', value: 'hsl(120 60% 30%)' }
  ];

  // =====================================================
  // Handle image upload
  // =====================================================
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onAlbumCoverChange) return;

    const reader = new FileReader();
    reader.onload = e => {
      if (e.target?.result) {
        onAlbumCoverChange(e.target.result as string);
        setIsEditing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const applyIconAndColor = () => {
    if (onAlbumCoverChange) {
      onAlbumCoverChange(`icon:${selectedIcon}:${selectedColor}`);
      setIsEditing(false);
    }
  };

  const startEditing = (
    field: 'title' | 'artist' | 'album',
    currentValue?: string
  ) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const saveEdit = () => {
    if (editingField && onSongInfoChange) {
      onSongInfoChange(editingField, editValue.trim());
    }
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // =====================================================
  // Album cover renderer (fixed sizes)
  // =====================================================
  const renderAlbumCover = () => {
    const size = 'w-24 h-24';

    if (!albumCover) {
      return (
        <div
          className={`${size} bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105`}
        >
          <Music className="h-10 w-10 text-white" />
        </div>
      );
    }

    // ICON COVER
    if (albumCover.startsWith('icon:')) {
      const [, iconName, iconColor] = albumCover.split(':');
      const IconComponent =
        iconOptions.find(o => o.name === iconName)?.icon || Music;

      return (
        <div
          className={`${size} rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105`}
          style={{ backgroundColor: iconColor }}
        >
          <IconComponent className="h-10 w-10 text-white" />
        </div>
      );
    }

    // IMAGE COVER
    return (
      <img
        src={albumCover}
        alt={`${album || title} album cover`}
        className={`${size} rounded-xl object-cover shadow-lg transition-all duration-300 hover:scale-105`}
      />
    );
  };

  if (!title && !artist) return null;

  return (
    <SpotlightEffect className="bg-card/80 backdrop-blur-xl rounded-2xl p-6 shadow-card border border-border/50 animate-fade-in">
      
      <div className="flex items-center space-x-5">
        
        {/* Album Cover (spotlight applies only here) */}
        <div className="relative group">
          {renderAlbumCover()}

          {/* Edit button */}
          {onAlbumCoverChange && (
            <Popover open={isEditing} onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card/80 border-border/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-80 bg-card/95 backdrop-blur-md border-border/40">
                <Card className="border-0 bg-transparent">
                  <CardContent className="p-4 space-y-4">

                    <h3 className="font-semibold text-foreground">
                      Customize Album Cover
                    </h3>

                    {/* Upload Image */}
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Upload Image
                      </label>

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

                    {/* Divider */}
                    <div className="border-t border-border/20 pt-4">
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Or Choose Icon & Color
                      </label>

                      {/* ICONS */}
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {iconOptions.map(opt => (
                          <button
                            key={opt.name}
                            onClick={() => setSelectedIcon(opt.name)}
                            className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                              selectedIcon === opt.name
                                ? 'border-primary bg-primary/10'
                                : 'border-border/30 hover:border-border/60'
                            }`}
                          >
                            <opt.icon className="w-5 h-5 mx-auto" />
                          </button>
                        ))}
                      </div>

                      {/* COLORS */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {colorOptions.map(color => (
                          <button
                            key={color.value}
                            onClick={() => setSelectedColor(color.value)}
                            className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                              selectedColor === color.value
                                ? 'border-primary shadow-glow'
                                : 'border-border/30'
                            }`}
                            style={{ backgroundColor: color.value, opacity: 0.85 }}
                          />
                        ))}
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

        {/* Song Info Text */}
        <div className="flex-1 min-w-0 space-y-1">
          
          {/* Title */}
          <EditableField
            label={title}
            field="title"
            editingField={editingField}
            editValue={editValue}
            onStart={() => startEditing('title', title)}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onChange={setEditValue}
            onSongInfoChange={onSongInfoChange}
          />

          {/* Artist */}
          <EditableField
            label={artist}
            field="artist"
            editingField={editingField}
            editValue={editValue}
            onStart={() => startEditing('artist', artist)}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onChange={setEditValue}
            onSongInfoChange={onSongInfoChange}
          />

          {/* Album */}
          <EditableField
            label={album}
            field="album"
            editingField={editingField}
            editValue={editValue}
            onStart={() => startEditing('album', album)}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onChange={setEditValue}
            onSongInfoChange={onSongInfoChange}
            small
          />

        </div>

      </div>
    </SpotlightEffect>
  );
}

/*
 Small reusable editing component
 - reduces repeated code
*/
function EditableField({
  label,
  field,
  editingField,
  editValue,
  onStart,
  onSave,
  onCancel,
  onChange,
  onSongInfoChange,
  small = false
}: any) {
  const isEditing = editingField === field;

  const textClass = small
    ? 'text-sm text-muted-foreground/80'
    : 'text-lg text-foreground';

  return (
    <div className="group flex items-center">
      {isEditing ? (
        <div className="flex items-center space-x-2 flex-1">
          <Input
            value={editValue}
            onChange={e => onChange(e.target.value)}
            className="flex-1 bg-input/50 border-border/50"
            autoFocus
          />
          <Button size="sm" onClick={onSave} className="w-8 h-8 p-0">
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <>
          <p
            className={`${textClass} truncate transition-all duration-200 hover:scale-105 cursor-default flex-1`}
          >
            {label || `Unknown ${field}`}
          </p>

          {onSongInfoChange && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onStart}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 w-8 h-8 p-0"
            >
              <Edit2 className="w-3 h-3" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
