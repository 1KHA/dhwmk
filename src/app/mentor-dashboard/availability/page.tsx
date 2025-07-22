"use client";

import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '../../../../components/ui/button';
import { useToast } from "../../../../components/ui/use-toast"

const localizer = momentLocalizer(moment);

interface Availability {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const AvailabilityPage = () => {
  const [events, setEvents] = useState<Availability[]>([]);
  const { toast } = useToast();

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch('/api/mentor/availability');
      if (response.ok) {
        const data = await response.json();
        const formattedEvents = data.map((avail: any) => ({
          id: avail.id,
          start: new Date(avail.startTime),
          end: new Date(avail.endTime),
          title: 'Available',
        }));
        setEvents(formattedEvents);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch availabilities.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching availabilities.",
        variant: "destructive",
      })
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const handleSelectSlot = async ({ start, end }: { start: Date; end: Date }) => {
    try {
      const response = await fetch('/api/mentor/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startTime: start, endTime: end }),
      });

      if (response.ok) {
        fetchAvailabilities();
        toast({
          title: "Success",
          description: "Availability added successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to add availability.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding availability.",
        variant: "destructive",
      })
    }
  };

  const handleSelectEvent = async (event: Availability) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        const response = await fetch(`/api/mentor/availability/${event.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchAvailabilities();
          toast({
            title: "Success",
            description: "Availability deleted successfully.",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete availability.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while deleting availability.",
          variant: "destructive",
        })
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Your Availability</h1>
      <p className="mb-4">Click and drag on the calendar to create new availability slots. Click on an existing slot to delete it.</p>
      <div style={{ height: '70vh', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          defaultView="week"
          views={['day', 'week', 'agenda']}
        />
      </div>
    </div>
  );
};

export default AvailabilityPage;
