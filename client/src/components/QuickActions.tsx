import { Mic, Unlock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onTalk: () => void;
  onUnlock: () => void;
  onAlert: () => void;
  isUnlocking?: boolean;
  isTriggering?: boolean;
}

export function QuickActions({ 
  onTalk, 
  onUnlock, 
  onAlert, 
  isUnlocking, 
  isTriggering 
}: QuickActionsProps) {
  return (
    <section className="bg-white shadow-lg border-b border-gray-200">
      <div className="px-4 py-4">
        <div className="grid grid-cols-3 gap-4">
          {/* Talk Button */}
          <Button
            onClick={onTalk}
            className="bg-primary-blue text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:bg-opacity-90 transition-all h-auto"
          >
            <Mic className="h-6 w-6" />
            <span className="text-sm font-medium">Talk</span>
          </Button>
          
          {/* Unlock Door Button */}
          <Button
            onClick={onUnlock}
            disabled={isUnlocking}
            className="bg-accent-coral text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:bg-opacity-90 transition-all h-auto disabled:opacity-50"
          >
            <Unlock className="h-6 w-6" />
            <span className="text-sm font-medium">
              {isUnlocking ? "Unlocking..." : "Unlock"}
            </span>
          </Button>
          
          {/* Alert/Emergency Button */}
          <Button
            onClick={onAlert}
            disabled={isTriggering}
            className="bg-soft-teal text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:bg-opacity-90 transition-all h-auto disabled:opacity-50"
          >
            <AlertTriangle className="h-6 w-6" />
            <span className="text-sm font-medium">
              {isTriggering ? "Alerting..." : "Alert"}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
