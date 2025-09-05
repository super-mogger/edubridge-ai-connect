import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { GraduationCap, Users, BookOpen, Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoggingIn(true);
      await login(email, password, selectedRole);
      toast({
        title: "Welcome to EduBridge!",
        description: `Successfully logged in as ${selectedRole}.`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const roleIcons = {
    teacher: BookOpen,
    parent: Users,
    student: GraduationCap
  };

  const demoCredentials = {
    teacher: { email: 'teacher@demo.com', password: 'demo123' },
    parent: { email: 'parent@demo.com', password: 'demo123' },
    student: { email: 'student@demo.com', password: 'demo123' }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-success/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo & Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-success p-3 rounded-2xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            EduBridge
          </h1>
          <p className="text-muted-foreground">
            AI-powered learning platform connecting teachers, parents, and students
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-0 shadow-xl bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Choose your role and sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="teacher" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Teacher
                </TabsTrigger>
                <TabsTrigger value="parent" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Parent
                </TabsTrigger>
                <TabsTrigger value="student" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Student
                </TabsTrigger>
              </TabsList>

              {/* Form for each role */}
              {(['teacher', 'parent', 'student'] as UserRole[]).map((role) => (
                <TabsContent key={role} value={role} className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={`Enter your ${role} email`}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-success hover:from-primary-hover hover:to-success/90 text-white font-medium"
                      disabled={isLoggingIn || loading}
                    >
                      {isLoggingIn ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="bg-muted/30 p-3 rounded-lg border border-dashed border-muted-foreground/30">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><strong>Email:</strong> {demoCredentials[role].email}</p>
                      <p><strong>Password:</strong> {demoCredentials[role].password}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEmail(demoCredentials[role].email);
                        setPassword(demoCredentials[role].password);
                      }}
                      className="mt-2 h-8 text-xs"
                    >
                      Use Demo Credentials
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Empowering education with AI-driven insights
        </p>
      </div>
    </div>
  );
};

export default Login;