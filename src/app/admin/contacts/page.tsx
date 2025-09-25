"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { ContactSubmission } from '@/lib/supabase';

export default function ContactsAdmin() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'unread' | 'read' | 'replied') => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status } : sub
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-red-100 text-red-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-8">Loading contact submissions...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-gray-600 mt-2">{submissions.length} total submissions</p>
      </div>

      <div className="space-y-4">
        {submissions.map((submission) => (
          <div key={submission.id} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                  {submission.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(submission.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateStatus(submission.id, 'read')}
                  className="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => updateStatus(submission.id, 'replied')}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Mark Replied
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <strong className="text-lg">{submission.name}</strong>
                <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                  {submission.email}
                </a>
              </div>
              <div className="font-medium text-gray-700">
                Subject: {submission.subject}
              </div>
              <div className="text-gray-600 bg-gray-50 p-3 rounded">
                {submission.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No contact submissions yet.
        </div>
      )}
    </div>
  );
}