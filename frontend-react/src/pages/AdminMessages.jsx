import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Mail, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminMessages() {
  const queryClient = useQueryClient();

  // ✅ GET messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const res = await api.get('/contact-messages');
      return res.data;
    },
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/contact-messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted');
    },
    onError: () => {
    toast.error('Failed to delete message');
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          Loading messages...
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <AdminPageHeader title="Messages" subtitle={`${messages.length} contact messages`} />

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            No messages yet. They'll appear here when visitors use the contact form.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-4 mb-3">

                      <span className="flex items-center gap-2 font-semibold">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {msg.name}
                      </span>

                      <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Mail className="w-3.5 h-3.5" />
                        {msg.email}
                      </a>

                      {msg.created_at && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(new Date(msg.created_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      )}
                    </div>

                    <p className="text-muted-foreground whitespace-pre-line">
                      {msg.message}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(msg.id)}
                    className="text-destructive hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}