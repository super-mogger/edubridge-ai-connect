import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Award,
  Clock,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for parent dashboard
const childData = {
  name: "Aadhya Sharma",
  grade: "5th Grade",
  currentScore: 92,
  overallProgress: 85,
  recentExams: [
    { subject: "English", score: 92, date: "2024-01-15", trend: "up" },
    { subject: "Math", score: 88, date: "2024-01-10", trend: "up" },
    { subject: "Science", score: 85, date: "2024-01-08", trend: "stable" },
    { subject: "Social Studies", score: 90, date: "2024-01-05", trend: "up" }
  ],
  strengths: ["Creative Writing", "Problem Solving", "Active Participation"],
  improvements: ["Handwriting", "Time Management"],
  upcomingEvents: [
    { title: "Parent-Teacher Meeting", date: "2024-01-25", type: "meeting" },
    { title: "Science Project Due", date: "2024-01-28", type: "assignment" },
    { title: "Math Quiz", date: "2024-01-30", type: "assessment" }
  ]
};

const alerts = [
  {
    id: 1,
    type: "improvement",
    message: "Handwriting has improved by 15% this week!",
    time: "2 hours ago"
  },
  {
    id: 2,
    type: "attention",
    message: "Consider practicing math problems for 10 minutes daily",
    time: "1 day ago"
  },
  {
    id: 3,
    type: "achievement",
    message: "Excellent performance in creative writing assignment!",
    time: "3 days ago"
  }
];

const ParentDashboard = () => {
  const { user } = useAuth();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-destructive rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-muted-foreground rotate-90" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="h-4 w-4 text-success" />;
      case 'improvement': return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'attention': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <p className="text-muted-foreground">
          Track {childData.name}'s learning journey and progress
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Average</CardTitle>
            <Award className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childData.currentScore}%</div>
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childData.overallProgress}%</div>
            <Progress value={childData.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childData.upcomingEvents.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Exam Results
            </CardTitle>
            <CardDescription>
              {childData.name}'s performance across subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {childData.recentExams.map((exam, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">{exam.subject}</p>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-lg">{exam.score}%</span>
                  {getTrendIcon(exam.trend)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations for {childData.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium text-sm mb-3 text-success">Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {childData.strengths.map((strength, index) => (
                  <Badge key={index} className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-3 text-warning">Areas for Improvement</h4>
              <div className="flex flex-wrap gap-2">
                {childData.improvements.map((improvement, index) => (
                  <Badge key={index} className="bg-warning/10 text-warning border-warning/20">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {improvement}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-primary to-success text-white">
              View Detailed Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Upcoming Events */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Important updates and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {childData.upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.date}</p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {event.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParentDashboard;