import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Target,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Award,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for student dashboard
const studentData = {
  name: "Aadhya Sharma",
  grade: "5th Grade",
  overallScore: 92,
  weeklyGoal: 85,
  weeklyProgress: 78,
  recentScores: [88, 92, 85, 90, 94],
  achievements: [
    { title: "Creative Writer", icon: "✍️", date: "This week" },
    { title: "Math Explorer", icon: "🔢", date: "Last week" },
    { title: "Perfect Attendance", icon: "⭐", date: "This month" }
  ],
  upcomingAssignments: [
    { subject: "English", title: "Creative Story", dueDate: "Jan 25", priority: "high" },
    { subject: "Math", title: "Geometry Practice", dueDate: "Jan 28", priority: "medium" },
    { subject: "Science", title: "Solar System Project", dueDate: "Feb 2", priority: "low" }
  ],
  aiSuggestions: [
    "Great job on your creative writing! Try writing for 10 minutes daily to improve further.",
    "Your math scores are improving. Practice multiplication tables for better speed.",
    "Keep up the excellent work in science. Consider reading more about space exploration."
  ]
};

const StudentDashboard = () => {
  const { user } = useAuth();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {studentData.name}! 🌟</h1>
        <p className="text-muted-foreground">
          You're doing amazing! Keep up the great work in {studentData.grade}.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Trophy className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{studentData.overallScore}%</div>
            <p className="text-xs text-muted-foreground">Excellent work!</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <Target className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.weeklyProgress}%</div>
            <Progress value={studentData.weeklyProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Target: {studentData.weeklyGoal}%</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Due</CardTitle>
            <Clock className="h-5 w-5 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentData.upcomingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Progress
            </CardTitle>
            <CardDescription>Your last 5 exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Latest Scores</span>
                <div className="flex gap-2">
                  {studentData.recentScores.map((score, index) => (
                    <div
                      key={index}
                      className={`w-10 h-10 rounded-full bg-muted/30 flex items-center justify-center text-sm font-medium ${getScoreColor(score)}`}
                    >
                      {score}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/20 p-4 rounded-lg">
                <p className="text-sm font-medium">Keep it up! 📈</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your scores are trending upward. You're on track for your goals!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Achievements
            </CardTitle>
            <CardDescription>Celebrate your wins! 🎉</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {studentData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.date}</p>
                </div>
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Upcoming Assignments
          </CardTitle>
          <CardDescription>Stay organized and never miss a deadline!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentData.upcomingAssignments.map((assignment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-10 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Due: {assignment.dueDate}</span>
                  <Badge className={getPriorityColor(assignment.priority)}>
                    {assignment.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-br from-primary/5 to-success/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Learning Tips 🤖
          </CardTitle>
          <CardDescription>Personalized suggestions just for you!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {studentData.aiSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-primary/20">
              <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">{suggestion}</p>
            </div>
          ))}
          <Button className="w-full bg-gradient-to-r from-primary to-success text-white mt-4">
            Get More Personalized Tips
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;