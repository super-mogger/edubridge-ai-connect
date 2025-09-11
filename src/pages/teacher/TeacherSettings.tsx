import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Settings,
  User,
  Bell,
  Shield,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Lock,
  FileText,
  Languages
} from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// ------------------------------------------------------------
// Settings Page (Teacher Portal)
// ------------------------------------------------------------
// This page demonstrates a settings interface for teachers with:
// 1. Profile settings (personal information, avatar)
// 2. Notification preferences
// 3. Privacy & sharing controls
// 4. AI feedback customization
// 5. API integration settings (for advanced users)
// 
// The page uses zod for form validation and react-hook-form
// for form state management, with toast notifications for feedback.
// ------------------------------------------------------------

// ---------------------------
// Validation Schemas
// ---------------------------
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().max(500, { message: "Bio must be 500 characters or less." }).optional(),
  subject: z.string().min(2, { message: "Subject is required" }),
  grade: z.string().min(1, { message: "Grade level is required" }),
  school: z.string().min(2, { message: "School name is required" })
});

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  newStudentWork: z.boolean(),
  aiInsightsReady: z.boolean(),
  weeklyReports: z.boolean(),
  parentMessages: z.boolean(),
  systemUpdates: z.boolean()
});

const privacyFormSchema = z.object({
  shareAnalytics: z.boolean(),
  shareProgress: z.boolean(),
  publicProfile: z.boolean(),
  dataRetention: z.enum(['30days', '90days', '1year', 'forever']),
});

const aiFeedbackSchema = z.object({
  feedbackStyle: z.enum(['detailed', 'concise', 'simple']),
  focusAreas: z.array(z.string()).min(1, { message: "Select at least one focus area" }).default([]),
  customPrompt: z.string().max(1000).optional(),
  includeExamples: z.boolean(),
  useFormalLanguage: z.boolean(),
});

const apiSettingsSchema = z.object({
  apiKey: z.string().optional(),
  webhookUrl: z.string().url().optional().or(z.literal('')),
  enableIntegration: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;
type PrivacyFormValues = z.infer<typeof privacyFormSchema>;
type AIFeedbackFormValues = z.infer<typeof aiFeedbackSchema>;
type APISettingsFormValues = z.infer<typeof apiSettingsSchema>;

const TeacherSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [isKeyRegenPending, setIsKeyRegenPending] = useState(false);

  // ---------------------------------
  // Default values for each form 
  // ---------------------------------
  // In a real app, these would come from an API call to get user settings
  // Here we use hardcoded defaults based on the mock user
  const defaultProfileValues: ProfileFormValues = {
    name: user?.name || '',
    email: user?.email || '',
    bio: 'English teacher with 8+ years of experience, focused on creative writing and literature analysis.',
    subject: user?.subject || '',
    grade: '5th Grade',
    school: 'Edubridge Academy'
  };

  const defaultNotificationValues: NotificationsFormValues = {
    emailNotifications: true,
    pushNotifications: true,
    newStudentWork: true,
    aiInsightsReady: true,
    weeklyReports: true,
    parentMessages: true,
    systemUpdates: false
  };

  const defaultPrivacyValues: PrivacyFormValues = {
    shareAnalytics: true,
    shareProgress: true,
    publicProfile: false,
    dataRetention: '1year',
  };

  const defaultAIFeedbackValues: AIFeedbackFormValues = {
    feedbackStyle: 'detailed',
    focusAreas: ['grammar', 'structure', 'creativity'],
    customPrompt: '',
    includeExamples: true,
    useFormalLanguage: true,
  };

  const defaultAPIValues: APISettingsFormValues = {
    apiKey: 'sk_edb_2f8a9d1c7b3e5f4a6d2c8b9e7d6f3a2e1d0c9b8a7',
    webhookUrl: '',
    enableIntegration: false,
  };

  // ---------------------------------
  // Form Hooks
  // ---------------------------------
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultProfileValues,
    mode: "onChange",
  });

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: defaultNotificationValues,
  });

  const privacyForm = useForm<PrivacyFormValues>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: defaultPrivacyValues,
  });

  const aiFeedbackForm = useForm<AIFeedbackFormValues>({
    resolver: zodResolver(aiFeedbackSchema),
    defaultValues: defaultAIFeedbackValues,
  });

  const apiSettingsForm = useForm<APISettingsFormValues>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: defaultAPIValues,
  });

  // ---------------------------------
  // Form Submission Handlers
  // ---------------------------------
  const onProfileSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
    
    setIsSubmitting(false);
  };

  const onNotificationsSubmit = async (data: NotificationsFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    toast({
      title: "Notification preferences saved",
      description: "Your notification settings have been updated.",
    });
    
    setIsSubmitting(false);
  };

  const onPrivacySubmit = async (data: PrivacyFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));
    
    toast({
      title: "Privacy settings updated",
      description: `Data retention policy set to ${data.dataRetention}.`,
    });
    
    setIsSubmitting(false);
  };

  const onAIFeedbackSubmit = async (data: AIFeedbackFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 900));
    
    toast({
      title: "AI feedback preferences updated",
      description: `Feedback style set to ${data.feedbackStyle} with ${data.focusAreas.length} focus areas.`,
    });
    
    setIsSubmitting(false);
  };

  const onAPISettingsSubmit = async (data: APISettingsFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "API settings updated",
      description: data.enableIntegration 
        ? "External integrations are now enabled." 
        : "External integrations are now disabled.",
    });
    
    setIsSubmitting(false);
  };

  // ---------------------------------
  // Helper functions
  // ---------------------------------
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "API key copied to clipboard.",
    });
  };

  const regenerateApiKey = async () => {
    setIsKeyRegenPending(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const newKey = 'sk_edb_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    apiSettingsForm.setValue('apiKey', newKey);
    
    toast({
      title: "API key regenerated",
      description: "Your new API key has been created. The old key is now invalid.",
    });
    
    setIsKeyRegenPending(false);
  };

  // Focus areas for AI feedback
  const focusAreaOptions = [
    { value: 'grammar', label: 'Grammar & Spelling' },
    { value: 'structure', label: 'Structure & Organization' },
    { value: 'creativity', label: 'Creativity & Innovation' },
    { value: 'clarity', label: 'Clarity & Communication' },
    { value: 'reasoning', label: 'Critical Reasoning' },
    { value: 'presentation', label: 'Presentation Quality' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Customize your teaching experience, manage notifications, and control your data and privacy preferences.
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Privacy
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> AI Feedback
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Languages className="h-4 w-4" /> API & Integrations
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information visible to school administrators and parents.
              </CardDescription>
            </CardHeader>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <CardContent className="space-y-6">
                  {/* Avatar upload (placeholder) */}
                  <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-muted-foreground">
                        {user?.name?.split(" ").map(n => n[0]).join("")}
                      </div>
                    </div>
                    <Button variant="outline" type="button" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" /> Change Avatar
                    </Button>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@edubridge.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Subject you teach" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade Level</FormLabel>
                          <FormControl>
                            <Input placeholder="Grade level" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="school"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School</FormLabel>
                          <FormControl>
                            <Input placeholder="School name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself and your teaching philosophy"
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>This will be visible to parents and administrators.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Last changed 2 months ago</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "Password change functionality is coming soon." })}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Coming Soon", description: "2FA functionality is coming soon." })}>
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control when and how you receive notifications from EduBridge.
              </CardDescription>
            </CardHeader>
            <Form {...notificationsForm}>
              <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Delivery Methods</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Email Notifications</FormLabel>
                              <FormDescription>Receive notifications via email</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="pushNotifications"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Push Notifications</FormLabel>
                              <FormDescription>Receive notifications in the browser</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={notificationsForm.control}
                        name="newStudentWork"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>New Student Work</FormLabel>
                              <FormDescription>When students submit new assignments or papers</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="aiInsightsReady"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>AI Insights Ready</FormLabel>
                              <FormDescription>When new AI feedback or reports are available</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="weeklyReports"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Weekly Summary Reports</FormLabel>
                              <FormDescription>Weekly digest of class activity and progress</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="parentMessages"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Parent Messages</FormLabel>
                              <FormDescription>When parents send you a message</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={notificationsForm.control}
                        name="systemUpdates"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>System Updates</FormLabel>
                              <FormDescription>New features and improvements to EduBridge</FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Notification Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy & Data Sharing</CardTitle>
              <CardDescription>
                Control how your data is used and shared within EduBridge
              </CardDescription>
            </CardHeader>
            <Form {...privacyForm}>
              <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sharing Preferences</h3>
                    <div className="grid gap-4">
                      <FormField
                        control={privacyForm.control}
                        name="shareAnalytics"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Share Analytics</FormLabel>
                              <FormDescription>
                                Allow EduBridge to analyze usage patterns to improve the platform
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={privacyForm.control}
                        name="shareProgress"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Share Progress with School Administration</FormLabel>
                              <FormDescription>
                                Allow administrators to see class progress and AI insights
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={privacyForm.control}
                        name="publicProfile"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Public Teacher Profile</FormLabel>
                              <FormDescription>
                                Make your profile visible to other teachers in the EduBridge network
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Data Retention</h3>
                    
                    <FormField
                      control={privacyForm.control}
                      name="dataRetention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data Retention Period</FormLabel>
                          <div className="grid grid-cols-4 gap-3">
                            <Button 
                              type="button" 
                              variant={field.value === '30days' ? 'default' : 'outline'}
                              onClick={() => privacyForm.setValue('dataRetention', '30days')}
                              className="w-full"
                            >
                              30 Days
                            </Button>
                            <Button 
                              type="button" 
                              variant={field.value === '90days' ? 'default' : 'outline'}
                              onClick={() => privacyForm.setValue('dataRetention', '90days')}
                              className="w-full"
                            >
                              90 Days
                            </Button>
                            <Button 
                              type="button" 
                              variant={field.value === '1year' ? 'default' : 'outline'}
                              onClick={() => privacyForm.setValue('dataRetention', '1year')}
                              className="w-full"
                            >
                              1 Year
                            </Button>
                            <Button 
                              type="button" 
                              variant={field.value === 'forever' ? 'default' : 'outline'}
                              onClick={() => privacyForm.setValue('dataRetention', 'forever')}
                              className="w-full"
                            >
                              Forever
                            </Button>
                          </div>
                          <FormDescription>
                            How long EduBridge will store your students' data and AI feedback
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2">Data Export & Deletion</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can export or delete all your data from EduBridge at any time.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" onClick={() => toast({ title: "Export Started", description: "Your data export is being prepared. You'll receive an email when it's ready." })}>
                        Export All Data
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={() => toast({ 
                          title: "Are you sure?", 
                          description: "This action cannot be undone. All your data will be permanently deleted.", 
                          variant: "destructive" 
                        })}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Privacy Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* AI Feedback Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Feedback Preferences</CardTitle>
              <CardDescription>
                Customize how AI generates feedback for your students' work
              </CardDescription>
            </CardHeader>
            <Form {...aiFeedbackForm}>
              <form onSubmit={aiFeedbackForm.handleSubmit(onAIFeedbackSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={aiFeedbackForm.control}
                      name="feedbackStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Feedback Style</FormLabel>
                          <div className="grid grid-cols-3 gap-3">
                            <Button 
                              type="button" 
                              variant={field.value === 'detailed' ? 'default' : 'outline'}
                              onClick={() => aiFeedbackForm.setValue('feedbackStyle', 'detailed')}
                              className="w-full"
                            >
                              Detailed
                            </Button>
                            <Button 
                              type="button" 
                              variant={field.value === 'concise' ? 'default' : 'outline'}
                              onClick={() => aiFeedbackForm.setValue('feedbackStyle', 'concise')}
                              className="w-full"
                            >
                              Concise
                            </Button>
                            <Button 
                              type="button" 
                              variant={field.value === 'simple' ? 'default' : 'outline'}
                              onClick={() => aiFeedbackForm.setValue('feedbackStyle', 'simple')}
                              className="w-full"
                            >
                              Simple
                            </Button>
                          </div>
                          <FormDescription>
                            How comprehensive the AI feedback should be
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiFeedbackForm.control}
                      name="focusAreas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Focus Areas</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {focusAreaOptions.map(option => (
                              <Button
                                key={option.value}
                                type="button"
                                variant={field.value.includes(option.value) ? 'default' : 'outline'}
                                onClick={() => {
                                  const updated = field.value.includes(option.value)
                                    ? field.value.filter(v => v !== option.value)
                                    : [...field.value, option.value];
                                  aiFeedbackForm.setValue('focusAreas', updated);
                                }}
                                className="w-full"
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          <FormDescription>
                            Select areas the AI should focus on in feedback
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={aiFeedbackForm.control}
                      name="customPrompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom AI Prompt (Advanced)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Example: Focus on identifying creative expression and provide specific examples where the student showed critical thinking."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Custom instructions to guide the AI feedback generation (leave blank for default)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <FormField
                        control={aiFeedbackForm.control}
                        name="includeExamples"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Include Examples</FormLabel>
                              <FormDescription>
                                AI will provide specific examples from student work
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={aiFeedbackForm.control}
                        name="useFormalLanguage"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Use Formal Language</FormLabel>
                              <FormDescription>
                                Feedback uses more professional tone
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2">AI Feedback Preview</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Sample of how AI feedback will look with your current settings:
                    </p>
                    <div className="rounded border p-3 bg-card">
                      <p className="text-sm">
                        {aiFeedbackForm.watch('feedbackStyle') === 'detailed' ? (
                          <>The essay demonstrates strong <span className="font-medium text-primary">creative expression</span> through vivid imagery and metaphor. For example, the description of "clouds like cotton candy" shows imaginative thinking. The <span className="font-medium text-primary">structure</span> follows a logical progression with clear introduction, body paragraphs, and conclusion. Consider improving <span className="font-medium text-warning">grammar</span> by reviewing subject-verb agreement in paragraphs 2 and 4.</>
                        ) : aiFeedbackForm.watch('feedbackStyle') === 'concise' ? (
                          <>Strong points: Creative metaphors, logical structure. Areas to improve: Check grammar in paragraphs 2 and 4, specifically subject-verb agreement.</>
                        ) : (
                          <>Good job on creativity! Fix grammar mistakes in paragraphs 2 and 4.</>
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save AI Preferences
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>

        {/* API & Integrations Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>
                Connect external tools and services with your EduBridge account
              </CardDescription>
            </CardHeader>
            <Form {...apiSettingsForm}>
              <form onSubmit={apiSettingsForm.handleSubmit(onAPISettingsSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={apiSettingsForm.control}
                      name="enableIntegration"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Enable API Access</FormLabel>
                            <FormDescription>
                              Allow external applications to access your EduBridge data
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiSettingsForm.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <div className="flex">
                            <div className="relative flex-grow">
                              <FormControl>
                                <Input 
                                  type={apiKeyVisible ? 'text' : 'password'} 
                                  {...field} 
                                  readOnly
                                />
                              </FormControl>
                              <button
                                type="button"
                                onClick={() => setApiKeyVisible(!apiKeyVisible)}
                                className="absolute right-12 top-3 text-muted-foreground hover:text-foreground"
                              >
                                {apiKeyVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(field.value || '')}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={regenerateApiKey}
                              disabled={isKeyRegenPending}
                              className="ml-2"
                            >
                              {isKeyRegenPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            </Button>
                          </div>
                          <FormDescription>
                            Use this key to authenticate with the EduBridge API
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiSettingsForm.control}
                      name="webhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://your-app.com/edubridge-webhook"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Receive notifications when new feedback or reports are available
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <h3 className="text-sm font-medium mb-2">Available Integrations</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => toast({ title: "Coming Soon", description: "Google Classroom integration coming soon." })}
                      >
                        <img src="/placeholder.svg" alt="Google Classroom" className="h-8 w-8" />
                        <span className="text-xs">Google Classroom</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => toast({ title: "Coming Soon", description: "Microsoft Teams integration coming soon." })}
                      >
                        <img src="/placeholder.svg" alt="Microsoft Teams" className="h-8 w-8" />
                        <span className="text-xs">Microsoft Teams</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-24 flex flex-col items-center justify-center gap-2"
                        onClick={() => toast({ title: "Coming Soon", description: "Canvas LMS integration coming soon." })}
                      >
                        <img src="/placeholder.svg" alt="Canvas LMS" className="h-8 w-8" />
                        <span className="text-xs">Canvas LMS</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save API Settings
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Developer Documentation</CardTitle>
              <CardDescription>
                Resources for building applications with the EduBridge API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  API Documentation
                </Button>
                <Button variant="outline" className="justify-start">
                  <Check className="mr-2 h-4 w-4" />
                  Integration Guides
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Need help? Contact our developer support at dev-support@edubridge.com
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSettings;
