import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Upload, 
  FileText, 
  Eye, 
  Download, 
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock data for student papers
const mockPapers = [
  {
    id: 1,
    studentName: "Aadhya Sharma",
    subject: "English Essay",
    uploadDate: "2024-01-20",
    status: "reviewed",
    aiScore: 92,
    grammarScore: 88,
    creativityScore: 95,
    handwritingScore: 85,
    feedback: "Excellent creative expression with minor grammar improvements needed."
  },
  {
    id: 2,
    studentName: "Arjun Patel",
    subject: "Math Problem Set",
    uploadDate: "2024-01-19",
    status: "pending",
    aiScore: null,
    grammarScore: null,
    creativityScore: null,
    handwritingScore: null,
    feedback: null
  },
  {
    id: 3,
    studentName: "Diya Singh",
    subject: "Science Report", 
    uploadDate: "2024-01-18",
    status: "in-progress",
    aiScore: 87,
    grammarScore: 90,
    creativityScore: 82,
    handwritingScore: 89,
    feedback: "Good scientific reasoning, work on conclusion clarity."
  }
];

const StudentPapers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPapers = mockPapers.filter(paper => {
    const matchesSearch = paper.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || paper.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reviewed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-warning" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'bg-success/10 text-success border-success/20';
      case 'in-progress': return 'bg-warning/10 text-warning border-warning/20';
      case 'pending': return 'bg-muted/10 text-muted-foreground border-muted/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Papers</h1>
          <p className="text-muted-foreground">
            Upload, review, and provide AI-powered feedback on student submissions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-success text-white">
          <Upload className="h-4 w-4 mr-2" />
          Upload New Papers
        </Button>
      </div>

      {/* Upload Area */}
      <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Upload Student Papers</h3>
          <p className="text-muted-foreground text-center max-w-sm mb-6">
            Drag and drop PDF or image files, or click to browse. AI will automatically analyze and provide feedback.
          </p>
          <Button className="bg-gradient-to-r from-primary to-success text-white">
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Papers List */}
      <div className="grid gap-6">
        {filteredPapers.map((paper) => (
          <Card key={paper.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    {paper.subject}
                  </CardTitle>
                  <CardDescription>
                    by {paper.studentName} • Uploaded {paper.uploadDate}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(paper.status)}>
                  {getStatusIcon(paper.status)}
                  <span className="ml-1 capitalize">{paper.status.replace('-', ' ')}</span>
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {paper.aiScore && (
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-success/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Overall Score</p>
                    <p className="text-2xl font-bold text-success">{paper.aiScore}%</p>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Grammar</p>
                    <p className="text-2xl font-bold text-primary">{paper.grammarScore}%</p>
                  </div>
                  <div className="text-center p-3 bg-warning/5 rounded-lg">
                    <p className="text-sm text-muted-foreground">Creativity</p>
                    <p className="text-2xl font-bold text-warning">{paper.creativityScore}%</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Handwriting</p>
                    <p className="text-2xl font-bold">{paper.handwritingScore}%</p>
                  </div>
                </div>
              )}

              {paper.feedback && (
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">AI Feedback:</p>
                  <p className="text-sm text-muted-foreground">{paper.feedback}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {paper.status === 'pending' && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Start AI Analysis
                    </Button>
                  )}
                  {paper.status === 'reviewed' && (
                    <Button variant="outline" size="sm">
                      Edit Feedback
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Paper
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No papers found</h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Upload your first batch of student papers to get started.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentPapers;