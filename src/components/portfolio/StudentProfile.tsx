import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen,
  Download,
  Edit,
  Github,
  Linkedin,
  Globe,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface StudentProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  bio?: string;
  skills?: string[];
  languages?: string[];
  interests?: string[];
  custom_links?: { name: string; url: string; icon?: string }[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  updated_at: string;
}

const StudentProfile = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLinksDialogOpen, setIsLinksDialogOpen] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    bio: '',
    skills: '',
    languages: '',
    interests: '',
    github_url: '',
    linkedin_url: '',
    portfolio_url: '',
  });

  // Custom links state
  const [customLinks, setCustomLinks] = useState<{ name: string; url: string; icon?: string }[]>([]);
  const [newLink, setNewLink] = useState({ name: '', url: '', icon: '' });

  useEffect(() => {
    if (profile) {
      fetchProfileData();
    }
  }, [profile]);

  const fetchProfileData = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // For now, use mock data since we don't have extended profile table
      const mockProfile: StudentProfileData = {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone: '+1 (555) 123-4567',
        address: '123 University Ave, College Town, ST 12345',
        date_of_birth: '2000-05-15',
        bio: 'Passionate computer science student with interests in web development, artificial intelligence, and open source contributions. Always eager to learn new technologies and solve complex problems.',
        skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS'],
        languages: ['English (Native)', 'Spanish (Intermediate)', 'French (Basic)'],
        interests: ['Web Development', 'Machine Learning', 'Open Source', 'Photography', 'Hiking'],
        custom_links: [
          { name: 'Personal Blog', url: 'https://myblog.com', icon: 'Globe' },
          { name: 'Research Paper', url: 'https://arxiv.org/paper123', icon: 'BookOpen' }
        ],
        github_url: 'https://github.com/johndoe',
        linkedin_url: 'https://linkedin.com/in/johndoe',
        portfolio_url: 'https://johndoe.dev',
        updated_at: new Date().toISOString(),
      };
      
      setProfileData(mockProfile);
      setCustomLinks(mockProfile.custom_links || []);
      
      // Populate edit form
      setEditForm({
        full_name: mockProfile.full_name,
        phone: mockProfile.phone || '',
        address: mockProfile.address || '',
        date_of_birth: mockProfile.date_of_birth || '',
        bio: mockProfile.bio || '',
        skills: mockProfile.skills?.join(', ') || '',
        languages: mockProfile.languages?.join(', ') || '',
        interests: mockProfile.interests?.join(', ') || '',
        github_url: mockProfile.github_url || '',
        linkedin_url: mockProfile.linkedin_url || '',
        portfolio_url: mockProfile.portfolio_url || '',
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      // In a real implementation, this would update the extended profile table
      const updatedProfile: StudentProfileData = {
        ...profileData!,
        full_name: editForm.full_name,
        phone: editForm.phone,
        address: editForm.address,
        date_of_birth: editForm.date_of_birth,
        bio: editForm.bio,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(s => s),
        languages: editForm.languages.split(',').map(s => s.trim()).filter(s => s),
        interests: editForm.interests.split(',').map(s => s.trim()).filter(s => s),
        github_url: editForm.github_url,
        linkedin_url: editForm.linkedin_url,
        portfolio_url: editForm.portfolio_url,
        custom_links: customLinks,
        updated_at: new Date().toISOString(),
      };

      setProfileData(updatedProfile);
      setIsEditDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const addCustomLink = () => {
    if (newLink.name && newLink.url) {
      setCustomLinks([...customLinks, { ...newLink }]);
      setNewLink({ name: '', url: '', icon: '' });
    }
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const generatePDF = async () => {
    setGeneratingPDF(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Success',
        description: 'Resume PDF generated successfully!',
      });
      
      // In a real implementation, this would trigger a download
      console.log('PDF would be downloaded here');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate PDF',
        variant: 'destructive',
      });
    } finally {
      setGeneratingPDF(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="h-4 w-4" />;
      case 'Linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'Globe':
        return <Globe className="h-4 w-4" />;
      case 'BookOpen':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="text-center py-4">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Student Profile</h2>
          <p className="text-muted-foreground">Complete profile and resume information</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your profile information and resume details.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="123 University Ave, College Town, ST 12345"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={editForm.date_of_birth}
                    onChange={(e) => setEditForm({ ...editForm, date_of_birth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Brief description about yourself..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma-separated)</Label>
                    <Textarea
                      id="skills"
                      value={editForm.skills}
                      onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                      placeholder="JavaScript, Python, React..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages (comma-separated)</Label>
                    <Textarea
                      id="languages"
                      value={editForm.languages}
                      onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                      placeholder="English (Native), Spanish..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (comma-separated)</Label>
                    <Textarea
                      id="interests"
                      value={editForm.interests}
                      onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                      placeholder="Web Development, AI..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL</Label>
                    <Input
                      id="github_url"
                      value={editForm.github_url}
                      onChange={(e) => setEditForm({ ...editForm, github_url: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                    <Input
                      id="linkedin_url"
                      value={editForm.linkedin_url}
                      onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio_url">Portfolio URL</Label>
                    <Input
                      id="portfolio_url"
                      value={editForm.portfolio_url}
                      onChange={(e) => setEditForm({ ...editForm, portfolio_url: e.target.value })}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Button onClick={generatePDF} disabled={generatingPDF}>
            <Download className="h-4 w-4 mr-2" />
            {generatingPDF ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profileData.full_name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{profileData.full_name}</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profileData.address}</span>
                  </div>
                )}
                {profileData.date_of_birth && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Born {new Date(profileData.date_of_birth).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              {profileData.bio && (
                <p className="mt-4 text-muted-foreground leading-relaxed">{profileData.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="h-5 w-5" />
              <span>Links & Social Media</span>
            </CardTitle>
            <Dialog open={isLinksDialogOpen} onOpenChange={setIsLinksDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Custom Link</DialogTitle>
                  <DialogDescription>
                    Add a custom link to your profile (portfolio, blog, research, etc.)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="link_name">Link Name</Label>
                    <Input
                      id="link_name"
                      value={newLink.name}
                      onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                      placeholder="e.g., Personal Blog"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link_url">URL</Label>
                    <Input
                      id="link_url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link_icon">Icon (optional)</Label>
                    <Input
                      id="link_icon"
                      value={newLink.icon}
                      onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                      placeholder="Globe, BookOpen, etc."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsLinksDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addCustomLink} disabled={!newLink.name || !newLink.url}>
                      Add Link
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.github_url && (
              <Button variant="outline" className="justify-start" onClick={() => window.open(profileData.github_url, '_blank')}>
                <Github className="h-4 w-4 mr-2" />
                GitHub Profile
              </Button>
            )}
            {profileData.linkedin_url && (
              <Button variant="outline" className="justify-start" onClick={() => window.open(profileData.linkedin_url, '_blank')}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn Profile
              </Button>
            )}
            {profileData.portfolio_url && (
              <Button variant="outline" className="justify-start" onClick={() => window.open(profileData.portfolio_url, '_blank')}>
                <Globe className="h-4 w-4 mr-2" />
                Portfolio Website
              </Button>
            )}
            {customLinks.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  className="justify-start flex-1" 
                  onClick={() => window.open(link.url, '_blank')}
                >
                  {getIconComponent(link.icon || 'ExternalLink')}
                  <span className="ml-2">{link.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCustomLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills, Languages, and Interests */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.skills?.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Languages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profileData.languages?.map((language, index) => (
                <div key={index} className="text-sm">
                  {language}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Interests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profileData.interests?.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;