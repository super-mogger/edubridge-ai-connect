import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  RefreshCw,
  Sparkles,
  Brain,
  Filter,
  Search,
  Lightbulb,
  GaugeCircle,
  Loader2,
  History,
  Tag,
  User
} from 'lucide-react';

// ------------------------------------------------------------
// AI Feedback Page (Teacher Portal)
// ------------------------------------------------------------
// This page is the teacher's hub for viewing AI-generated feedback
// on student submissions and class performance. It demonstrates:
// 1. Example usage of React Query with mocked asynchronous data.
// 2. UI patterns: summary metrics, filters, searchable list, detail panel.
// 3. Extensible architecture for later integration with a real backend / LLM.
// ------------------------------------------------------------

// ---------------------------
// Types
// ---------------------------
interface FeedbackItem {
  id: string;                    // Unique ID for the feedback entry
  studentName: string;           // Student the feedback belongs to
  subject: string;               // Subject / category
  submissionTitle: string;       // Title of the work (essay, report, etc.)
  aiScore: number;               // Overall AI quality or proficiency score (0-100)
  strengths: string[];           // Bullet points of strengths
  improvements: string[];        // Bullet points of suggested improvements
  generatedAt: string;           // ISO date string when feedback was generated
  status: 'draft' | 'final';     // Whether teacher has finalized / approved
  tags: string[];                // Helpful classification tags
}

// ---------------------------
// Mock Async Data Fetch
// ---------------------------
// In a real implementation this would call your backend API
// (e.g., /api/feedback?classId=...&timeframe=...) and likely
// support pagination + server-side filtering.
async function fetchFeedback(): Promise<FeedbackItem[]> {
  // Simulate network latency
  await new Promise(r => setTimeout(r, 600));
  return [
    {
      id: 'fb-1',
      studentName: 'Aadhya Sharma',
      subject: 'English',
      submissionTitle: 'Creative Writing: My Summer',
      aiScore: 92,
      strengths: ['Vivid imagery', 'Strong narrative voice', 'Excellent structure'],
      improvements: ['Minor grammar corrections', 'Expand conclusion'],
      generatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: 'final',
      tags: ['writing', 'creativity']
    },
    {
      id: 'fb-2',
      studentName: 'Arjun Patel',
      subject: 'Math',
      submissionTitle: 'Problem Set: Fractions & Ratios',
      aiScore: 78,
      strengths: ['Correct methodology', 'Good logical progression'],
      improvements: ['Improve fraction simplification speed', 'Show intermediate steps'],
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'draft',
      tags: ['math', 'practice']
    },
    {
      id: 'fb-3',
      studentName: 'Diya Singh',
      subject: 'Science',
      submissionTitle: 'Report: Plant Life Cycle',
      aiScore: 85,
      strengths: ['Clear explanation', 'Accurate diagrams'],
      improvements: ['Add sources', 'Clarify germination stage'],
      generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'final',
      tags: ['science', 'report']
    }
  ];
}

// ---------------------------
// Mock Mutation: Regenerate Feedback
// ---------------------------
// Simulates an AI re-generation action. In a real system you would
// POST to an endpoint that triggers your model pipeline.
async function regenerateFeedback(id: string): Promise<{ id: string; newScore: number; timestamp: string; }>{
  await new Promise(r => setTimeout(r, 900));
  return { id, newScore: Math.floor(75 + Math.random() * 20), timestamp: new Date().toISOString() };
}

const AIFeedback: React.FC = () => {
  // Filter + UI state
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'final'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null); // Currently focused feedback item
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data using React Query (cached + status flags)
  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['ai-feedback'],
    queryFn: fetchFeedback
  });

  // Mutation for re-generating / improving a feedback entry
  const regenMutation = useMutation({
    mutationFn: regenerateFeedback,
    onSuccess: (result) => {
      // Optimistically update the existing cached list with new score + updated timestamp
      queryClient.setQueryData<FeedbackItem[]>(['ai-feedback'], (old) => {
        if (!old) return old;
        return old.map(item => item.id === result.id ? { ...item, aiScore: result.newScore, generatedAt: result.timestamp, status: 'draft' } : item);
      });
      toast({ title: 'Feedback regenerated', description: 'AI provided an updated analysis.' });
    },
    onError: () => {
      toast({ title: 'Regeneration failed', description: 'Please try again shortly.', variant: 'destructive' });
    }
  });

  // Compute derived filtered list (memoized for basic perf)
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter(item => {
      const matchesSearch = [item.studentName, item.submissionTitle, item.subject].some(v => v.toLowerCase().includes(search.toLowerCase()));
      const matchesSubject = subjectFilter === 'all' || item.subject.toLowerCase() === subjectFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [data, search, subjectFilter, statusFilter]);

  // Selected item for detail view (right panel)
  const selected = filtered.find(f => f.id === selectedId) || filtered[0] || null;

  // Simple aggregations for summary cards
  const summary = useMemo(() => {
    if (!data || data.length === 0) return { avgScore: 0, total: 0, drafts: 0, finals: 0 };
    const total = data.length;
    const avgScore = Math.round(data.reduce((a, b) => a + b.aiScore, 0) / total);
    const drafts = data.filter(i => i.status === 'draft').length;
    const finals = total - drafts;
    return { avgScore, total, drafts, finals };
  }, [data]);

  // Handler: trigger regeneration for selected item
  const handleRegenerate = (id: string) => {
    regenMutation.mutate(id);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" /> AI Feedback
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Centralized AI-generated insights for student submissions. Filter, refine, and finalize feedback before sharing.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <History className="h-3 w-3" /> Last refresh just now {isRefetching && <Loader2 className="h-3 w-3 animate-spin" />}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching || isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button onClick={() => toast({ title: 'Bulk generation queued', description: 'AI will analyze new submissions.' })}>
            <Sparkles className="h-4 w-4 mr-2" /> Generate New
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Average Score</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">{summary.avgScore}<GaugeCircle className="h-5 w-5 text-primary" /></div>
            <p className="text-xs text-muted-foreground">Across all feedback</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Total Items</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
              <p className="text-xs text-muted-foreground">Submissions analyzed</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Drafts</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.drafts}</div>
              <p className="text-xs text-muted-foreground">Need review</p>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/5 to-primary/10 border-success/30">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Finalized</CardTitle></CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.finals}</div>
              <p className="text-xs text-muted-foreground">Ready to share</p>
            </CardContent>
        </Card>
      </div>

      {/* Main Layout: Left (list + filters) | Right (detail) */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Filter className="h-5 w-5" /> Filters</CardTitle>
              <CardDescription>Refine visible feedback entries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search box */}
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input placeholder="Search student, subject, title..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Subject filter (basic) */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Subject</p>
                  <Select value={subjectFilter} onValueChange={v => setSubjectFilter(v)}>
                    <SelectTrigger className="h-9"><SelectValue placeholder="All" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="math">Math</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Status filter */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Placeholder for timeframe (future API parameter) */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Timeframe</p>
                  <Select defaultValue="30d">
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7d</SelectItem>
                      <SelectItem value="30d">Last 30d</SelectItem>
                      <SelectItem value="90d">Last 90d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <Card className="h-[560px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Feedback Items</CardTitle>
              <CardDescription>{filtered.length} shown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              {isLoading ? (
                <div className="h-full w-full flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="divide-y">
                    {filtered.map(item => {
                      const isActive = item.id === selected?.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedId(item.id)}
                          className={`w-full text-left p-4 flex flex-col gap-2 transition-colors hover:bg-muted/40 ${isActive ? 'bg-muted/60' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{item.studentName} • {item.subject}</p>
                            <Badge variant={item.status === 'final' ? 'default' : 'outline'} className="capitalize text-xs">{item.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">{item.submissionTitle}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.tags.map(t => (
                              <Badge key={t} variant="secondary" className="px-1.5 py-0 h-5 text-[10px] flex items-center gap-1"><Tag className="h-3 w-3" /> {t}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Score: <span className="font-semibold">{item.aiScore}</span></span>
                            <span>{new Date(item.generatedAt).toLocaleString()}</span>
                          </div>
                        </button>
                      );
                    })}
                    {filtered.length === 0 && (
                      <div className="p-6 text-center text-sm text-muted-foreground">No feedback matches current filters.</div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Detail Panel */}
        <div className="space-y-6 lg:col-span-7">
          {selected ? (
            <Card className="relative">
              <CardHeader className="pr-40">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-5 w-5 text-primary" /> {selected.submissionTitle}
                    </CardTitle>
                    <CardDescription>
                      {selected.studentName} • {selected.subject} • Score {selected.aiScore}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Strengths */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-success">
                    <Lightbulb className="h-4 w-4" /> Strengths
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selected.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <Separator />
                {/* Improvements */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-warning">
                    <Brain className="h-4 w-4" /> Suggested Improvements
                  </h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selected.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <Separator />
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" disabled={regenMutation.isPending} onClick={() => handleRegenerate(selected.id)}>
                    {regenMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                    Regenerate
                  </Button>
                  <Button size="sm" onClick={() => toast({ title: 'Marked final', description: 'Feedback is ready for student.' })} disabled={selected.status === 'final'}>
                    Mark Final
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => toast({ title: 'Export queued', description: 'Report export will download shortly.' })}>
                    Export Report
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast({ title: 'Shared', description: 'Feedback shared with student & parent.' })}>
                    Share
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">Generated {new Date(selected.generatedAt).toLocaleString()}</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[560px] flex items-center justify-center"><p className="text-sm text-muted-foreground">Select a feedback entry to view details.</p></Card>
          )}

          {/* Future Placeholder: Class-Level Insights */}
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Coming Soon: Deeper AI Insights</CardTitle>
              <CardDescription>Aggregated trends, skill heatmaps, longitudinal progress charts.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This section will visualize class-wide strengths & gaps, enabling targeted interventions.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Developer Notes (could be removed in production) */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Extensibility Notes</CardTitle>
          <CardDescription>How to grow this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-xs list-disc list-inside space-y-1 text-muted-foreground">
            <li>Integrate backend: Replace mock fetch with real endpoint + pagination.</li>
            <li>LLM pipeline: Provide submission text → store raw AI JSON → map to UI.</li>
            <li>Teacher edits: Allow inline editing & version history for transparency.</li>
            <li>Comparison mode: Select two students to diff strengths & gaps.</li>
            <li>Skill taxonomy: Tag each suggestion with standardized skill IDs.</li>
            <li>Export formats: PDF / CSV / Parent summary mode.</li>
            <li>Notification hooks: Auto-email parents on finalized feedback.</li>
            <li>Analytics: Track time-to-feedback, average improvement after revisions.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeedback;
