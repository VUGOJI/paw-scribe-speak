import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/AuthProvider';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Shield, Users, Database, Settings, LogOut, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, loading } = useAdminRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const adminStats = [
    {
      title: 'Total Users',
      value: '0',
      icon: Users,
      color: 'from-primary to-secondary',
    },
    {
      title: 'Database Tables',
      value: '3',
      icon: Database,
      color: 'from-secondary to-accent',
    },
    {
      title: 'Admin Users',
      value: '1',
      icon: Shield,
      color: 'from-accent to-pet-orange',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate('/')}
                className="border-border/50"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="gap-2 border-border/50 hover:border-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {adminStats.map((stat, index) => (
            <Card key={index} className="pet-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-medium`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="pet-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your Pet Translator application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-start gap-2 border-border/50"
                onClick={() => window.open('https://lovable.dev', '_blank')}
              >
                <Users className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs text-muted-foreground">View and manage user accounts</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-start gap-2 border-border/50"
                onClick={() => toast({ title: 'Coming soon!', description: 'Database management features are in development' })}
              >
                <Database className="w-5 h-5 text-secondary" />
                <div className="text-left">
                  <div className="font-semibold">Database</div>
                  <div className="text-xs text-muted-foreground">View and manage database tables</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-start gap-2 border-border/50"
                onClick={() => toast({ title: 'Coming soon!', description: 'Settings management features are in development' })}
              >
                <Settings className="w-5 h-5 text-accent" />
                <div className="text-left">
                  <div className="font-semibold">Settings</div>
                  <div className="text-xs text-muted-foreground">Configure application settings</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 flex-col items-start gap-2 border-border/50"
                onClick={() => toast({ title: 'Coming soon!', description: 'Admin management features are in development' })}
              >
                <Shield className="w-5 h-5 text-pet-orange" />
                <div className="text-left">
                  <div className="font-semibold">Admin Roles</div>
                  <div className="text-xs text-muted-foreground">Manage admin permissions</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card className="pet-card">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Database Status</span>
                <span className="font-semibold text-success">● Connected</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Authentication</span>
                <span className="font-semibold text-success">● Active</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Admin ID</span>
                <span className="font-mono text-xs">{user?.id.substring(0, 8)}...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
