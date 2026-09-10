import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Plus
} from 'lucide-react';
import { mockEvents } from '../../data/mockData';
import { EventItem } from '../../types';
import { useApp } from '../../context/AppContext';

export const EventsView: React.FC = () => {
  const { triggerConfetti } = useApp();
  const [eventsList, setEventsList] = useState<EventItem[]>(mockEvents);
  const [selectedType, setSelectedType] = useState('All');

  const types = ['All', 'Hackathon', 'Workshop', 'Career Fair', 'Guest Lecture'];

  const toggleRegister = (eventId: string) => {
    setEventsList(prev =>
      prev.map(ev => {
        if (ev.id === eventId) {
          const newStatus = !ev.isRegistered;
          if (newStatus) triggerConfetti();
          return {
            ...ev,
            isRegistered: newStatus,
            seatsRemaining: newStatus ? ev.seatsRemaining - 1 : ev.seatsRemaining + 1
          };
        }
        return ev;
      })
    );
  };

  const filteredEvents = eventsList.filter(e => {
    if (selectedType === 'All') return true;
    return e.type.toLowerCase() === selectedType.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1 border border-blue-100">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            Campus & Industry Events
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            Hackathons, Masterclasses & Placement Fairs
          </h1>
          <p className="text-xs text-slate-500">
            Participate in sponsored hackathons, guest lectures with industry heads, and university placement drives.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-500">Upcoming Events:</span>
          <span className="text-lg font-black text-blue-600 ml-2">{eventsList.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedType === type
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                  {event.type}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {event.seatsRemaining} seats left
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 mb-1">{event.title}</h2>
              <p className="text-xs font-semibold text-blue-700 mb-3">{event.organizer}</p>

              <div className="space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>{event.location}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-3">{event.description}</p>

              {event.speakers && (
                <div className="text-xs text-slate-500">
                  <span className="font-bold text-slate-700">Featuring: </span>
                  {event.speakers.join(', ')}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-4">
              <button
                onClick={() => alert(`Added ${event.title} to your Google / Outlook calendar!`)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                + Add to Calendar
              </button>

              <button
                onClick={() => toggleRegister(event.id)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  event.isRegistered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {event.isRegistered ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Registered
                  </>
                ) : (
                  'Register Now'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
