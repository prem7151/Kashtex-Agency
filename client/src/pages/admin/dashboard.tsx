import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const leads = [
    { id: 1, name: "John Doe", email: "john@example.com", service: "Website", date: "2023-10-25", status: "New" },
    { id: 2, name: "Sarah Smith", email: "sarah@tech.co", service: "E-commerce", date: "2023-10-24", status: "Contacted" },
    { id: 3, name: "Mike Johnson", email: "mike@cafe.com", service: "Menu App", date: "2023-10-23", status: "Closed" },
  ];

  const chatLogs = [
    { id: 1, user: "Visitor #4023", lastMsg: "How much for a basic site?", time: "10 mins ago" },
    { id: 2, user: "Visitor #3922", lastMsg: "Do you do mobile apps?", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-heading font-bold text-xl">Kashtex Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={activeTab === "overview" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("overview")}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Overview
          </Button>
          <Button variant={activeTab === "leads" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("leads")}>
            <Users className="mr-2 h-4 w-4" /> Leads
          </Button>
          <Button variant={activeTab === "chat" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("chat")}>
            <MessageSquare className="mr-2 h-4 w-4" /> Chatbot Logs
          </Button>
          <Button variant={activeTab === "settings" ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setActiveTab("settings")}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </nav>
        <div className="p-4 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" /> Exit
            </Button>
          </Link>
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
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Currently online</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenue (Est)</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$4,200</div>
                  <p className="text-xs text-muted-foreground">Pending invoices</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>Potential clients from contact form.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}<br/><span className="text-xs text-muted-foreground">{lead.email}</span></TableCell>
                        <TableCell>{lead.service}</TableCell>
                        <TableCell>{lead.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{lead.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
             <Card>
              <CardHeader>
                <CardTitle>AI Chat Logs</CardTitle>
                <CardDescription>Review automated conversations.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Last Message</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chatLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell className="truncate max-w-[200px]">{log.lastMsg}</TableCell>
                        <TableCell>{log.time}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">Read Log</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
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
                      <div className="text-xs text-red-500 font-mono mt-1">STRIPE_SECRET_KEY not set</div>
                    </div>
                    <Switch disabled />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI Chatbot</Label>
                      <div className="text-sm text-muted-foreground">Enable OpenAI powered responses.</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Admin Email for Notifications</Label>
                    <Input defaultValue="siteveraa@gmail.com" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
