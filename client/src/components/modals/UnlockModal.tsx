import { Unlock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isUnlocking?: boolean;
}

export function UnlockModal({ isOpen, onClose, onConfirm, isUnlocking }: UnlockModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full p-6">
        <DialogHeader>
          <div className="w-16 h-16 bg-accent-coral bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Unlock className="h-8 w-8 text-accent-coral" />
          </div>
          <DialogTitle className="text-lg font-semibold text-dark-gray text-center">
            Unlock Door?
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            This will unlock your front door for 10 seconds.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex space-x-3 mt-6">
          <Button 
            variant="outline"
            className="flex-1 py-3"
            onClick={onClose}
            disabled={isUnlocking}
          >
            Cancel
          </Button>
          <Button 
            className="flex-1 py-3 bg-accent-coral hover:bg-accent-coral/90"
            onClick={onConfirm}
            disabled={isUnlocking}
          >
            {isUnlocking ? "Unlocking..." : "Unlock"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
