import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Camera, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  streamUrl?: string;
  isLive?: boolean;
  onScreenshot?: () => void;
}

export function VideoPlayer({ 
  streamUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450",
  isLive = true,
  onScreenshot 
}: VideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <section className="bg-black relative">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={streamUrl}
          alt="Live doorbell camera feed" 
          className="w-full h-full object-cover" 
        />
        
        {/* Live status indicator */}
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="flex items-center bg-accent-coral text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium">
              {isLive ? "LIVE" : "OFFLINE"}
            </span>
          </div>
          <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
            HD
          </div>
        </div>

        {/* Person detection overlay */}
        <div className="absolute top-1/3 left-1/4 w-16 h-20 border-2 border-soft-teal rounded animate-pulse">
          <div className="bg-soft-teal text-white text-xs px-2 py-1 rounded-b -mt-px">
            <span>John Doe</span>
          </div>
        </div>

        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                onClick={onScreenshot}
              >
                <Camera className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                onClick={() => {/* TODO: Implement fullscreen */}}
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-white text-sm font-medium">
              {currentTime}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
