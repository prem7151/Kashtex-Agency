import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/ui/chatbot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2, CalendarIcon, Send, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please enter a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const appointmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  service: z.string().min(1, "Please select a service"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  details: z.string().optional(),
});

export default function Contact() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const appointmentForm = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { name: "", email: "", service: "", time: "", details: "" },
  });

  const { data: availableSlots, isLoading: slotsLoading } = useQuery({
    queryKey: ["available-slots", selectedDate?.toISOString().split("T")[0]],
    queryFn: async () => {
      if (!selectedDate) return null;
      const dateStr = selectedDate.toISOString().split("T")[0];
      const res = await fetch(`/api/appointments/available?date=${dateStr}`);
      if (!res.ok) throw new Error("Failed to fetch available slots");
      return res.json() as Promise<{ availableSlots: string[]; bookedTimes: string[] }>;
    },
    enabled: !!selectedDate,
  });

  const contactMutation = useMutation({
    mutationFn: async (values: z.infer<typeof contactSchema>) => {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      contactForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const appointmentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof appointmentSchema>) => {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString().split("T")[0],
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to book appointment");
      }
      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Appointment Requested",
        description: `Schedule for ${format(variables.date, "PPP")} at ${variables.time} submitted.`,
      });
      appointmentForm.reset();
      setSelectedDate(undefined);
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onContactSubmit = (values: z.infer<typeof contactSchema>) => {
    contactMutation.mutate(values);
  };

  const onAppointmentSubmit = (values: z.infer<typeof appointmentSchema>) => {
    appointmentMutation.mutate(values);
  };

  const allTimeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
  const timeSlots = availableSlots?.availableSlots || allTimeSlots;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16 bg-muted/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-modern-dots pointer-events-none opacity-[0.05]" />
        <div className="absolute top-0 left-0 w-full h-full bg-noise pointer-events-none" />
        <div className="container px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-heading font-bold mb-4">Contact & Appointments</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Reach out for general inquiries or schedule a direct consultation with our engineering team.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Sidebar Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <p className="text-sm text-muted-foreground">kashtex1@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <p className="text-sm text-muted-foreground">+91 8200369078</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <p className="font-medium text-sm">Location</p>
                        <p className="text-sm text-muted-foreground">Online-only Agency</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                  <h3 className="font-bold text-sm mb-2">Why book a call?</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our direct consultations help us understand your technical requirements better and provide accurate architectural advice for your project.
                  </p>
                </div>
              </div>

              {/* Main Form Tabs */}
              <div className="lg:col-span-2">
                <Tabs defaultValue="contact" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="contact" className="flex items-center gap-2" data-testid="tab-contact">
                      <Send className="h-4 w-4" /> Quick Message
                    </TabsTrigger>
                    <TabsTrigger value="appointment" className="flex items-center gap-2" data-testid="tab-appointment">
                      <Clock className="h-4 w-4" /> Book Appointment
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="contact">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>General inquiries and partnership opportunities.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...contactForm}>
                          <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={contactForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input placeholder="John Doe" data-testid="input-contact-name" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={contactForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="john@example.com" data-testid="input-contact-email" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <FormField
                              control={contactForm.control}
                              name="subject"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Subject</FormLabel>
                                  <FormControl><Input placeholder="How can we help?" data-testid="input-contact-subject" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={contactForm.control}
                              name="message"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Message</FormLabel>
                                  <FormControl><Textarea placeholder="Write your message here..." className="min-h-[120px]" data-testid="input-contact-message" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full" disabled={contactMutation.isPending} data-testid="button-submit-contact">
                              {contactMutation.isPending ? <Loader2 className="animate-spin" /> : "Send Message"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="appointment">
                    <Card className="border shadow-sm">
                      <CardHeader>
                        <CardTitle>Schedule a Call</CardTitle>
                        <CardDescription>Choose a specific time for a detailed project discussion.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...appointmentForm}>
                          <form onSubmit={appointmentForm.handleSubmit(onAppointmentSubmit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={appointmentForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl><Input placeholder="Your Name" data-testid="input-appointment-name" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={appointmentForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input placeholder="your@email.com" data-testid="input-appointment-email" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={appointmentForm.control}
                              name="service"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Project Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger data-testid="select-service"><SelectValue placeholder="Select project type" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                      <SelectItem value="website">Business Website</SelectItem>
                                      <SelectItem value="ecommerce">E-commerce Store</SelectItem>
                                      <SelectItem value="app">Custom Web App</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={appointmentForm.control}
                                name="date"
                                render={({ field }) => (
                                  <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} data-testid="button-date-picker">
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar 
                                          mode="single" 
                                          selected={field.value} 
                                          onSelect={(date) => {
                                            field.onChange(date);
                                            setSelectedDate(date);
                                            appointmentForm.setValue("time", "");
                                          }} 
                                          disabled={(date) => date < new Date()} 
                                          initialFocus 
                                        />
                                      </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={appointmentForm.control}
                                name="time"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || slotsLoading}>
                                      <FormControl>
                                        <SelectTrigger data-testid="select-time">
                                          <SelectValue placeholder={slotsLoading ? "Loading..." : "Select time"} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {timeSlots.length === 0 ? (
                                          <SelectItem value="none" disabled>No slots available</SelectItem>
                                        ) : (
                                          timeSlots.map(slot => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                          ))
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={appointmentForm.control}
                              name="details"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Extra Details (Optional)</FormLabel>
                                  <FormControl><Textarea placeholder="Any specific topics to discuss?" data-testid="input-appointment-details" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <Button type="submit" className="w-full" disabled={appointmentMutation.isPending} data-testid="button-submit-appointment">
                              {appointmentMutation.isPending ? <Loader2 className="animate-spin" /> : "Book My Call"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
}
