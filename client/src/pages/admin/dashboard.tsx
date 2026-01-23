import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, FileText, Calendar, Loader2, BarChart3, TrendingUp, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { isAdminAuthenticated, adminLogout, getContacts, getAppointments, getChatLogs, markContactRead, updateAppointmentStatus } from "@/lib/supabase";

type Contact = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

type Appointment = {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  time: string;
  details: string | null;
  status: string;
  created_at: string;
};

type ChatLog = {
  id: string;
  session_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  messages: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedChatLog, setSelectedChatLog] = useState<ChatLog | null>(null);

  const isAuthenticated = isAdminAuthenticated();
  const authLoading = false;

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      return await getContacts();
    },
    enabled: isAuthenticated,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      return await getAppointments();
    },
    enabled: isAuthenticated,
  });

  const { data: chatLogs = [], isLoading: chatLogsLoading } = useQuery<ChatLog[]>({
    queryKey: ["admin-chat-logs"],
    queryFn: async () => {
      return await getChatLogs();
    },
    enabled: isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await markContactRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await updateAppointmentStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast({ title: "Status updated" });
    },
  });

  const handleLogout = () => {
    adminLogout();
    queryClient.clear();
    setLocation("/admin/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const unreadContacts = contacts.filter(c => !c.is_read).length;
  const pendingAppointments = appointments.filter(a => a.status === "pending").length;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-heading font-bold text-xl">Kashtex Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("overview")} data-testid="nav-overview">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button variant={activeTab === "leads" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("leads")} data-testid="nav-leads">
            <Users className="mr-2 h-4 w-4" /> Leads
            {unreadContacts > 0 && <Badge variant="destructive" className="ml-auto">{unreadContacts}</Badge>}
          </Button>
          <Button variant={activeTab === "appointments" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("appointments")} data-testid="nav-appointments">
            <Calendar className="mr-2 h-4 w-4" /> Appointments
            {pendingAppointments > 0 && <Badge variant="secondary" className="ml-auto">{pendingAppointments}</Badge>}
          </Button>
          <Button variant={activeTab === "chat" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("chat")} data-testid="nav-chat">
            <MessageSquare className="mr-2 h-4 w-4" /> Chatbot Logs
          </Button>
          <Button variant={activeTab === "analytics" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("analytics")} data-testid="nav-analytics">
            <BarChart3 className="mr-2 h-4 w-4" /> Analytics
          </Button>
          <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("settings")} data-testid="nav-settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="md:hidden mb-6 flex justify-between items-center">
          <h1 className="font-heading font-bold text-xl">Kashtex Admin</h1>
          <Link href="/">
            <Button variant="outline" size="sm">Exit</Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="md:hidden">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="appointments">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{contacts.length}</div>
                  <p className="text-xs text-muted-foreground">{unreadContacts} unread</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                  <p className="text-xs text-muted-foreground">{pendingAppointments} pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{chatLogs.length}</div>
                  <p className="text-xs text-muted-foreground">Total conversations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (Est)</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0</div>
                  <p className="text-xs text-muted-foreground">Pending invoices</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {contactsLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                  ) : contacts.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No leads yet</p>
                  ) : (
                    <div className="space-y-3">
                      {contacts.slice(0, 5).map((contact) => (
                        <div key={contact.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.subject}</p>
                          </div>
                          {!contact.is_read && <Badge variant="destructive" className="text-xs">New</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
                  ) : appointments.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No appointments yet</p>
                  ) : (
                    <div className="space-y-3">
                      {appointments.filter(a => a.status === "pending").slice(0, 5).map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{apt.name}</p>
                            <p className="text-xs text-muted-foreground">{apt.date} at {apt.time}</p>
                          </div>
                          <Badge variant="outline">{apt.service}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>All Leads</CardTitle>
                <CardDescription>Contact form submissions from potential clients.</CardDescription>
              </CardHeader>
              <CardContent>
                {contactsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : contacts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No leads yet. Share your website to start collecting leads!</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            {contact.name}<br/>
                            <span className="text-xs text-muted-foreground">{contact.email}</span>
                          </TableCell>
                          <TableCell>{contact.subject}</TableCell>
                          <TableCell>{format(new Date(contact.created_at), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant={contact.is_read ? "outline" : "destructive"}>
                              {contact.is_read ? "Read" : "New"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedContact(contact);
                                if (!contact.is_read) {
                                  markReadMutation.mutate(contact.id);
                                }
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Message from {selectedContact?.name}</DialogTitle>
                  <DialogDescription>{selectedContact?.email}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Subject</Label>
                    <p className="font-medium">{selectedContact?.subject}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Message</Label>
                    <p className="whitespace-pre-wrap bg-muted p-3 rounded-lg text-sm">{selectedContact?.message}</p>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Received: {selectedContact && format(new Date(selectedContact.created_at), "MMM d, yyyy h:mm a")}</span>
                    <Badge variant={selectedContact?.is_read ? "outline" : "destructive"}>
                      {selectedContact?.is_read ? "Read" : "New"}
                    </Badge>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>Scheduled consultation calls.</CardDescription>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : appointments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No appointments yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((apt) => (
                        <TableRow key={apt.id}>
                          <TableCell className="font-medium">
                            {apt.name}<br/>
                            <span className="text-xs text-muted-foreground">{apt.email}</span>
                          </TableCell>
                          <TableCell>{apt.service}</TableCell>
                          <TableCell>{apt.date} at {apt.time}</TableCell>
                          <TableCell>
                            <Badge variant={
                              apt.status === "confirmed" ? "default" :
                              apt.status === "cancelled" ? "destructive" : "secondary"
                            }>
                              {apt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {apt.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => updateStatusMutation.mutate({ id: apt.id, status: "confirmed" })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-red-500"
                                  onClick={() => updateStatusMutation.mutate({ id: apt.id, status: "cancelled" })}
                                  disabled={updateStatusMutation.isPending}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
             <Card>
              <CardHeader>
                <CardTitle>AI Chat Logs</CardTitle>
                <CardDescription>Review automated conversations with visitors.</CardDescription>
              </CardHeader>
              <CardContent>
                {chatLogsLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : chatLogs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No chat conversations yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor</TableHead>
                        <TableHead>Session</TableHead>
                        <TableHead>Messages</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {chatLogs.map((log) => {
                        let messageCount = 0;
                        try {
                          messageCount = JSON.parse(log.messages).length;
                        } catch {}
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">
                              {log.visitor_name || "Anonymous"}<br/>
                              <span className="text-xs text-muted-foreground">{log.visitor_email || "No email"}</span>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{log.session_id.slice(0, 8)}...</TableCell>
                            <TableCell>{messageCount} messages</TableCell>
                            <TableCell>{format(new Date(log.created_at), "MMM d, yyyy h:mm a")}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedChatLog(log)}
                              >
                                <Eye className="h-3 w-3 mr-1" /> View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Dialog open={!!selectedChatLog} onOpenChange={() => setSelectedChatLog(null)}>
              <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle>Chat Conversation</DialogTitle>
                  <DialogDescription>
                    {selectedChatLog?.visitor_name || "Anonymous"} - {format(selectedChatLog ? new Date(selectedChatLog.created_at) : new Date(), "MMM d, yyyy h:mm a")}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto space-y-3 py-4">
                  {selectedChatLog && (() => {
                    try {
                      const msgs = JSON.parse(selectedChatLog.messages);
                      return msgs.map((msg: any, i: number) => (
                        <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] p-3 text-sm rounded-lg ${
                            msg.role === "user" 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ));
                    } catch {
                      return <p className="text-muted-foreground">Could not parse conversation</p>;
                    }
                  })()}
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {(() => {
              const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
              
              const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = format(date, "MMM d");
                const fullDate = format(date, "yyyy-MM-dd");
                return {
                  name: dateStr,
                  leads: contacts.filter(c => format(new Date(c.created_at), "yyyy-MM-dd") === fullDate).length,
                  appointments: appointments.filter(a => format(new Date(a.created_at), "yyyy-MM-dd") === fullDate).length,
                };
              });

              const serviceStats = appointments.reduce((acc, apt) => {
                acc[apt.service] = (acc[apt.service] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);
              
              const serviceData = Object.entries(serviceStats).map(([name, value]) => ({ name, value }));

              const statusStats = appointments.reduce((acc, apt) => {
                acc[apt.status] = (acc[apt.status] || 0) + 1;
                return acc;
              }, {} as Record<string, number>);

              const confirmedAppts = appointments.filter(a => a.status === "confirmed").length;
              const conversionRate = contacts.length > 0 
                ? Math.round((confirmedAppts / contacts.length) * 100) 
                : 0;

              return (
                <>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{contacts.length}</div>
                        <p className="text-xs text-green-500 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          All time
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{appointments.length}</div>
                        <p className="text-xs text-muted-foreground">{confirmedAppts} confirmed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{conversionRate}%</div>
                        <p className="text-xs text-muted-foreground">Leads to confirmed</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{chatLogs.length}</div>
                        <p className="text-xs text-muted-foreground">Visitor conversations</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Activity (Last 7 Days)</CardTitle>
                        <CardDescription>Leads and appointments over time</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <AreaChart data={last7Days}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip />
                            <Area type="monotone" dataKey="leads" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Leads" />
                            <Area type="monotone" dataKey="appointments" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Appointments" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Appointments by Service</CardTitle>
                        <CardDescription>Distribution of service requests</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {serviceData.length === 0 ? (
                          <p className="text-muted-foreground text-center py-16">No data yet</p>
                        ) : (
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={serviceData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {serviceData.map((_, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Appointment Status Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={[
                          { status: 'Pending', count: statusStats['pending'] || 0 },
                          { status: 'Confirmed', count: statusStats['confirmed'] || 0 },
                          { status: 'Cancelled', count: statusStats['cancelled'] || 0 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="status" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how you receive alerts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-2">
                    <Label>Admin Email for Notifications</Label>
                    <Input defaultValue="kashtex1@gmail.com" disabled />
                    <p className="text-xs text-muted-foreground">Email notifications will be sent to this address.</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Manage third-party services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Stripe Payments</Label>
                      <div className="text-sm text-muted-foreground">Enable payment processing for packages.</div>
                      <div className="text-xs text-amber-600 font-mono mt-1">Coming soon</div>
                    </div>
                    <Switch disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Chatbot</Label>
                      <div className="text-sm text-muted-foreground">Automated responses for visitor inquiries.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <div className="text-sm text-muted-foreground">Receive alerts for new leads and appointments.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
