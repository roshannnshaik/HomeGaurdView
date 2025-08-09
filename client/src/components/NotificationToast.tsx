import { Bell, X } from "lucide-react";
import { useEffect, useState } from "react";

interface NotificationToastProps {
  title: string;
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function NotificationToast({ title, message, isVisible, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg z-40 animate-in slide-in-from-top-2">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent-coral rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-dark-gray">{title}</p>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
          <button 
            className="text-gray-400 hover:text-gray-600"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
