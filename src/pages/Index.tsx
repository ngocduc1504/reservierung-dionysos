
import React from 'react';
import ReservationSystem from '../components/ReservationSystem';
import { Separator } from '../components/ui/separator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 font-serif">Dionysos Gotha</h1>
          <p className="text-gray-600 text-sm md:text-base italic">Griechisches Restaurant</p>
          <Separator className="max-w-xs mx-auto my-6 bg-gray-300" />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Tisch reservieren</h2>
        <ReservationSystem />
      </div>
    </div>
  );
};

export default Index;
