import { ArrowLeft, User, Mail, Phone, MapPin, Shield, LogOut } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();

  // Mock user data
  const user = {
    name: "Demo User",
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Smart Home Street",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-dark-gray">Profile</h1>
              <p className="text-xs text-gray-500">Manage your account</p>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="px-4 py-4 space-y-6">
        
        {/* User Info Card */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-dark-gray">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => toast({
              title: "Edit Profile",
              description: "Profile editing would open here.",
            })}
          >
            Edit Profile
          </Button>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">Contact Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-dark-gray">Email</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-dark-gray">Phone</p>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-dark-gray">Address</p>
                <p className="text-sm text-gray-500">{user.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-5 w-5 text-primary-blue" />
            <h3 className="text-lg font-semibold text-dark-gray">Security</h3>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Change Password",
                description: "Password change would open here.",
              })}
            >
              Change Password
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Two-Factor Authentication",
                description: "2FA settings would open here.",
              })}
            >
              Two-Factor Authentication
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Login History",
                description: "Login history would be shown here.",
              })}
            >
              Login History
            </Button>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-xl p-4 space-y-4">
          <h3 className="text-lg font-semibold text-dark-gray mb-4">App Settings</h3>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Data Export",
                description: "Data export would start here.",
              })}
            >
              Export Data
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Help & Support",
                description: "Support center would open here.",
              })}
            >
              Help & Support
            </Button>
            
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast({
                title: "Terms & Privacy",
                description: "Terms and privacy policy would open here.",
              })}
            >
              Terms & Privacy
            </Button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-xl p-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => toast({
              title: "Logged Out",
              description: "You have been logged out successfully.",
            })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </div>

      {/* Bottom padding for navigation */}
      <div className="h-20"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
