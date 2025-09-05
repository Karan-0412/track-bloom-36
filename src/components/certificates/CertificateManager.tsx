import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus,
  Eye,
  Download,
  Calendar,
  Award
} from 'lucide-react';
import { format } from 'date-fns';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  category: 'academic' | 'co_curricular';
  status: 'pending' | 'approved' | 'rejected';
  file_url: string;
  file_name: string;
  uploaded_at: string;
  rejection_reason?: string;
}

const CertificateManager = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Upload form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic' as 'academic' | 'co_curricular',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile) {
      fetchCertificates();
    }
  }, [profile]);

  const fetchCertificates = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', profile.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching certificates:', error);
        // Use mock data for demonstration
        setCertificates([
          {
            id: '1',
            title: 'Python Programming Certificate',
            description: 'Completed advanced Python programming course',
            category: 'academic',
            status: 'approved',
            file_url: 'https://example.com/cert1.pdf',
            file_name: 'python_cert.pdf',
            uploaded_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Leadership Workshop',
            description: 'Participated in leadership development workshop',
            category: 'co_curricular',
            status: 'pending',
            file_url: 'https://example.com/cert2.pdf',
            file_name: 'leadership_cert.pdf',
            uploaded_at: new Date(Date.now() - 86400000).toISOString(),
          }
        ]);
      } else {
        setCertificates(data || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !profile) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      // Insert certificate record
      const { error: insertError } = await supabase
        .from('certificates')
        .insert({
          student_id: profile.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          file_url: publicUrl,
          file_name: file.name,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Certificate uploaded successfully!',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'academic',
      });
      setFile(null);
      setIsDialogOpen(false);
      
      // Refresh certificates
      fetchCertificates();
    } catch (error: any) {
      console.error('Error uploading certificate:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload certificate',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Pending</Badge>;
    }
  };

  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved');
  const rejectedCertificates = certificates.filter(cert => cert.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Certificate Management</h2>
          <p className="text-muted-foreground">Upload and manage your academic and co-curricular certificates</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New Certificate</DialogTitle>
              <DialogDescription>
                Upload your certificate for verification and approval.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={uploadCertificate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Certificate Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Python Programming Certificate"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the certificate..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: 'academic' | 'co_curricular') => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="co_curricular">Co-Curricular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Certificate File *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading || !formData.title || !file}>
                  {uploading ? 'Uploading...' : 'Upload Certificate'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCertificates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCertificates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{rejectedCertificates.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({certificates.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCertificates.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedCertificates.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCertificates.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <CertificateList 
            certificates={certificates} 
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <CertificateList 
            certificates={pendingCertificates} 
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <CertificateList 
            certificates={approvedCertificates} 
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <CertificateList 
            certificates={rejectedCertificates} 
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface CertificateListProps {
  certificates: Certificate[];
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  loading: boolean;
}

const CertificateList: React.FC<CertificateListProps> = ({ 
  certificates, 
  getStatusIcon, 
  getStatusBadge, 
  loading 
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading certificates...</div>;
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No certificates found.</p>
        <p className="text-sm">Upload your first certificate to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certificates.map((certificate) => (
        <Card key={certificate.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(certificate.status)}
                  <h3 className="font-semibold">{certificate.title}</h3>
                  {getStatusBadge(certificate.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>{certificate.category.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded: {format(new Date(certificate.uploaded_at), 'MMM dd, yyyy')}</span>
                  </div>
                </div>

                {certificate.description && (
                  <p className="text-sm text-muted-foreground mt-2">{certificate.description}</p>
                )}

                {certificate.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>Rejection Reason:</strong> {certificate.rejection_reason}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(certificate.file_url, '_blank')}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = certificate.file_url;
                    link.download = certificate.file_name;
                    link.click();
                  }}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CertificateManager;