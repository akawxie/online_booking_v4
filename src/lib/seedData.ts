import { supabase } from './supabase';

const instruments = [
  {
    name: 'Electron Microscope X2000',
    type: 'Microscope',
    location: 'Lab A-101',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1516357231954-91487b459602?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Mass Spectrometer Pro',
    type: 'Spectrometer',
    location: 'Lab B-202',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Ultra Centrifuge C-3000',
    type: 'Centrifuge',
    location: 'Lab C-303',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'NMR Spectrometer 500MHz',
    type: 'Spectrometer',
    location: 'Lab D-404',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'X-Ray Diffractometer',
    type: 'Diffractometer',
    location: 'Lab E-505',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1614308457932-e16d85c5d053?auto=format&fit=crop&q=80&w=400',
  },
  {
    name: 'Flow Cytometer',
    type: 'Cytometer',
    location: 'Lab F-606',
    status: 'Available',
    image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400',
  }
];

export async function seedInstruments() {
  // First, clear existing instruments
  const { error: deleteError } = await supabase
    .from('instruments')
    .delete()
    .neq('id', '0'); // Delete all records

  if (deleteError) {
    console.error('Error clearing instruments:', deleteError);
    return;
  }

  // Insert new instruments
  const { data, error } = await supabase
    .from('instruments')
    .insert(instruments)
    .select();

  if (error) {
    console.error('Error seeding instruments:', error);
    return;
  }

  console.log('Successfully seeded instruments:', data);
  return data;
}</content></file>

<boltAction type="file" filePath="src/App.tsx">import React, { useState, useEffect } from 'react';
import { Calendar, Search, Grid } from 'lucide-react';
import { Timeline } from './components/Timeline';
import { BookingModal } from './components/BookingModal';
import { InstrumentManagement } from './components/InstrumentManagement';
import { useBookings } from './hooks/useBookings';
import { useInstruments } from './hooks/useInstruments';
import { seedInstruments } from './lib/seedData';

function App() {
  const [selectedView, setSelectedView] = useState<'timeline' | 'management'>('timeline');
  const [bookingTimes, setBookingTimes] = useState<{ instrumentId: string; start: Date; end: Date } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);

  const { bookings, isLoading: isLoadingBookings, createBooking, deleteBooking } = useBookings();
  const { instruments, isLoading: isLoadingInstruments } = useInstruments();

  useEffect(() => {
    const initializeData = async () => {
      if (instruments.length === 0 && !isSeeding) {
        setIsSeeding(true);
        try {
          await seedInstruments();
        } catch (error) {
          console.error('Error seeding instruments:', error);
        } finally {
          setIsSeeding(false);
        }
      }
    };

    initializeData();
  }, [instruments.length, isSeeding]);

  const handleTimeSelect = (instrumentId: string, start: Date, end: Date) => {
    setBookingTimes({ instrumentId, start, end });
  };

  const handleBookingSubmit = (purpose: string) => {
    if (bookingTimes) {
      createBooking({
        instrumentId: bookingTimes.instrumentId,
        userId: 'current-user',
        startTime: bookingTimes.start,
        endTime: bookingTimes.end,
        purpose,
      });
      setBookingTimes(null);
    }
  };

  const filteredInstruments = instruments.filter((instrument) =>
    instrument.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instrument.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedInstrument = bookingTimes 
    ? instruments.find(i => i.id === bookingTimes.instrumentId)
    : null;

  const isLoading = isLoadingBookings || isLoadingInstruments || isSeeding;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">Instrument Scheduler</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search instruments..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                <button
                  onClick={() => setSelectedView('management')}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    selectedView === 'management'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Management
                </button>
                <button
                  onClick={() => setSelectedView('timeline')}
                  className={`px-4 py-2 flex items-center gap-2 ${
                    selectedView === 'timeline'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Timeline
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedView === 'timeline' ? (
          <div className="bg-white rounded-lg shadow-sm">
            <Timeline
              instruments={filteredInstruments}
              bookings={bookings}
              onTimeSelect={handleTimeSelect}
              onDeleteBooking={deleteBooking}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <InstrumentManagement />
        )}
      </main>

      {bookingTimes && selectedInstrument && (
        <BookingModal
          instrument={selectedInstrument}
          startTime={bookingTimes.start}
          endTime={bookingTimes.end}
          onClose={() => setBookingTimes(null)}
          onBook={handleBookingSubmit}
        />
      )}
    </div>
  );
}

export default App;