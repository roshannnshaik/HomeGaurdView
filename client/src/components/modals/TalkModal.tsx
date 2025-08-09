import { Mic, Volume2, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface TalkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  onStop: () => void;
}

export function TalkModal({ isOpen, onClose, onStart, onStop }: TalkModalProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleTalkPress = () => {
    if (!isTalking) {
      setIsTalking(true);
      onStart();
    }
  };

  const handleTalkRelease = () => {
    if (isTalking) {
      setIsTalking(false);
      onStop();
    }
  };

  const handleClose = () => {
    if (isTalking) {
      handleTalkRelease();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm w-full p-6">
        <DialogHeader>
          <div className="w-20 h-20 bg-primary-blue bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="h-10 w-10 text-primary-blue" />
          </div>
          <DialogTitle className="text-lg font-semibold text-dark-gray text-center">
            Two-Way Audio
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            Hold to talk with your visitor
          </DialogDescription>
        </DialogHeader>
        
        {/* Audio controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            <Volume2 className="h-5 w-5" />
          </Button>
          
          <Button
            className={`w-16 h-16 rounded-full transition-all ${
              isTalking 
                ? "bg-accent-coral hover:bg-accent-coral/90 scale-95" 
                : "bg-primary-blue hover:bg-primary-blue/90"
            }`}
            onMouseDown={handleTalkPress}
            onMouseUp={handleTalkRelease}
            onTouchStart={handleTalkPress}
            onTouchEnd={handleTalkRelease}
          >
            <Mic className="h-6 w-6 text-white" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="w-12 h-12 rounded-full"
            onClick={() => setIsMuted(!isMuted)}
          >
            <MicOff className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          variant="outline"
          className="w-full py-3"
          onClick={handleClose}
        >
          End Conversation
        </Button>
      </DialogContent>
    </Dialog>
  );
}
