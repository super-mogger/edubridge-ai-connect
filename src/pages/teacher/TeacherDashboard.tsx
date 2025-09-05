import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for teacher dashboard
const mockStudents = [
  {
    id: 1,
    name: "Aadhya Sharma",
    lastScore: 92,
    status: "excellent",
    grade: "A",
    recentActivity: "2 hours ago",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 2,
    name: "Arjun Patel",
    lastScore: 78,
    status: "good",
    grade: "B+",
    recentActivity: "1 day ago",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 3,
    name: "Diya Singh",
    lastScore: 85,
    status: "good",
    grade: "A-",
    recentActivity: "3 hours ago",
    avatar: "/api/placeholder/32/32"
  },
  {
    id: 4,
    name: "Kabir Mehta",
    lastScore: 65,
    status: "needs-attention",
    grade: "C+",
    recentActivity: "5 hours ago",
    avatar: "/api/placeholder/32/32"
  }
];

const mockStats = {
  totalStudents: 28,
  papersToReview: 12,
  averageScore: 82.5,
  improvementRate: 15.2
};

const TeacherDashboard = () => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success text-success-foreground';
      case 'good': return 'bg-primary text-primary-foreground';
      case 'needs-attention': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle className="h-4 w-4" />;
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'needs-attention': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening in your {user?.subject} class today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active this semester</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Papers to Review</CardTitle>
            <FileText className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.papersToReview}</div>
            <p className="text-xs text-muted-foreground">Awaiting feedback</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Class performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement</CardTitle>
            <TrendingUp className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{mockStats.improvementRate}%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Overview Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Overview</CardTitle>
              <CardDescription>
                Recent performance and status of your students
              </CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-primary to-success text-white">
              View All Students
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full bg-muted"
                  />
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last active: {student.recentActivity}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium">Last Score</p>
                    <p className="text-lg font-bold">{student.lastScore}%</p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium">Grade</p>
                    <p className="text-lg font-bold">{student.grade}</p>
                  </div>

                  <Badge className={getStatusColor(student.status)}>
                    {getStatusIcon(student.status)}
                    <span className="ml-1 capitalize">{student.status.replace('-', ' ')}</span>
                  </Badge>

                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/5 to-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Upload New Papers
            </CardTitle>
            <CardDescription>
              Upload and evaluate student papers with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-primary to-success text-white">
              Start Paper Review
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/5 to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Generate AI Report
            </CardTitle>
            <CardDescription>
              Get comprehensive AI insights on class performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;