/**
 * @file admin/calendar/page.tsx
 * @description Shoot calendar management - schedule and track photo sessions
 * @module app/admin/calendar
 */

'use client';

import { useState, useEffect } from 'react';
import { H2, Body } from '@/components/ui/Typography';
import { GlassCard } from '@/components/ui/GlassCard';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Calendar, Clock, MapPin, User, Camera, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

interface Shoot {
  id: string;
  venueName: string;
  date: string;
  time: string;
  tier: 'pilot' | 't1' | 't2' | 'vip';
  status: 'scheduled' | 'in_progress' | 'editing' | 'delivered';
  contactName: string;
  location: string;
  notes?: string;
}

const TIER_COLORS = {
  pilot: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
  t1: 'bg-green-500/20 text-green-400 border-green-500/50',
  t2: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
  vip: 'bg-[var(--brand-gold)]/20 text-[var(--brand-gold)] border-[var(--brand-gold)]/50',
};

const STATUS_COLORS = {
  scheduled: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  editing: 'bg-purple-500',
  delivered: 'bg-green-500',
};

// Sample data - in production, fetch from Firestore
const SAMPLE_SHOOTS: Shoot[] = [
  {
    id: '1',
    venueName: 'The Loft',
    date: '2024-12-06',
    time: '22:00',
    tier: 'pilot',
    status: 'scheduled',
    contactName: 'Mike Johnson',
    location: 'North Loop',
  },
  {
    id: '2',
    venueName: 'Skybar',
    date: '2024-12-07',
    time: '23:00',
    tier: 't2',
    status: 'scheduled',
    contactName: 'Sarah Chen',
    location: 'Warehouse District',
  },
  {
    id: '3',
    venueName: 'Noir Club',
    date: '2024-12-13',
    time: '22:30',
    tier: 'vip',
    status: 'scheduled',
    contactName: 'James Wilson',
    location: 'Downtown',
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shoots] = useState<Shoot[]>(SAMPLE_SHOOTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNewShootModal, setShowNewShootModal] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getShootsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return shoots.filter(shoot => shoot.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <main className="min-h-screen bg-[var(--brand-ink)] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <H2>Shoot Calendar</H2>
            <Body className="text-gray-400 mt-1">Schedule and manage photo sessions</Body>
          </div>
          <MagneticButton onClick={() => setShowNewShootModal(true)}>
            <Plus className="w-4 h-4 mr-2 inline" />
            New Shoot
          </MagneticButton>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <GlassCard>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const daysShoots = getShootsForDate(day);
                  const isToday = 
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        aspect-square p-1 rounded-lg transition-all relative
                        ${isToday ? 'ring-2 ring-[var(--brand-gold)]' : ''}
                        ${selectedDate === dateStr ? 'bg-[var(--brand-gold)]/20' : 'hover:bg-white/10'}
                      `}
                    >
                      <span className={`text-sm ${isToday ? 'text-[var(--brand-gold)] font-bold' : ''}`}>
                        {day}
                      </span>
                      {daysShoots.length > 0 && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {daysShoots.slice(0, 3).map(shoot => (
                            <div
                              key={shoot.id}
                              className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[shoot.status]}`}
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Sidebar - Upcoming Shoots */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Upcoming Shoots</h3>
            {shoots
              .filter(s => new Date(s.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map(shoot => (
                <GlassCard key={shoot.id} padding="sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{shoot.venueName}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(shoot.date).toLocaleDateString()}</span>
                        <Clock className="w-3 h-3 ml-2" />
                        <span>{shoot.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{shoot.location}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${TIER_COLORS[shoot.tier]}`}>
                      {shoot.tier.toUpperCase()}
                    </span>
                  </div>
                </GlassCard>
              ))}
          </div>
        </div>

        {/* CLI Commands Reference */}
        <GlassCard className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">📦 CLI Quick Reference</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="text-gray-400 mb-1"># Sync calendar to Firestore</p>
              <code className="text-[var(--brand-gold)]">firebase firestore:export shoots</code>
            </div>
            <div>
              <p className="text-gray-400 mb-1"># Deploy calendar updates</p>
              <code className="text-[var(--brand-gold)]">vercel --prod</code>
            </div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
