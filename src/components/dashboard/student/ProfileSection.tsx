import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, Profile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Edit, GraduationCap, Award, TrendingUp } from 'lucide-react';

interface ProfileSectionProps {
  certificates: Array<{
    id: string;
    status: 'pending' | 'approved' | 'rejected';
  }>;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ certificates }) => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  });

  const totalCertificates = certificates.length;
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved').length;
  const pendingCertificates = certificates.filter(cert => cert.status === 'pending').length;
  const progressPercentage = totalCertificates > 0 ? Math.round((approvedCertificates / totalCertificates) * 100) : 0;

  const handleSaveProfile = async () => {
    if (!profile) return;
    
    const { error } = await updateProfile(editForm);
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
    }
  };

  if (!profile) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-bold">Profile Overview</CardTitle>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsProfileOpen(true)}>PROFILE</Button>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input value={profile.student_id || 'Not assigned'} disabled />
                  <p className="text-sm text-muted-foreground">Student ID cannot be modified</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src="" alt={profile.full_name} />
            <AvatarFallback className="text-lg">
              {profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{profile.full_name}</h3>
            <p className="text-muted-foreground">{profile.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">
                <GraduationCap className="h-3 w-3 mr-1" />
                {profile.role}
              </Badge>
              {profile.student_id && (
                <Badge variant="outline">ID: {profile.student_id}</Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalCertificates}</div>
            <p className="text-sm text-muted-foreground">Total Certificates</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{approvedCertificates}</div>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{pendingCertificates}</div>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </CardContent>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={profile.full_name} />
                <AvatarFallback className="text-xl">
                  {profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.full_name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{profile.role}</Badge>
                  {profile.student_id && <Badge variant="outline">ID: {profile.student_id}</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-primary">{totalCertificates}</div>
                <p className="text-sm text-muted-foreground">Total Certificates</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{approvedCertificates}</div>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{pendingCertificates}</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="space-y-3 max-h-96 overflow-auto">
              {certificates.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">No certificates yet</div>
              ) : (
                certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between border rounded p-3">
                    <div className="space-y-1">
                      <div className="font-medium">Certificate #{cert.id.slice(0,6)}</div>
                      <div className="text-sm text-muted-foreground">Status: {cert.status}</div>
                    </div>
                    <Badge variant={cert.status==='approved' ? 'default' : cert.status==='pending' ? 'secondary' : 'destructive'} className={cert.status==='pending' ? 'bg-yellow-100 text-yellow-800' : ''}>
                      {cert.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfileSection;
