import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const { isAdmin, loading: checkingRole } = useAdminRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in and is admin, redirect to dashboard
    if (user && !checkingRole && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, isAdmin, checkingRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        toast({
          title: 'Login failed',
          description: error.message || 'Invalid credentials',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Check if user has admin role
      if (data?.user) {
        // The useEffect will handle the redirect
        toast({
          title: 'Checking admin access...',
          description: 'Please wait',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Show error if logged in but not admin
  useEffect(() => {
    if (user && !checkingRole && !isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        variant: 'destructive',
      });
    }
  }, [user, isAdmin, checkingRole, toast]);

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <Card className="w-full max-w-md pet-card">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-medium">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-border/50 focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
              disabled={loading || checkingRole}
            >
              {loading || checkingRole ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
