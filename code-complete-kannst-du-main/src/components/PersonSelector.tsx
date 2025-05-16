
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PersonSelectorProps {
  selectedPeople: number;
  onSelect: (people: number) => void;
}

const PersonSelector = ({ selectedPeople, onSelect }: PersonSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="section-title">Personen</div>
      <Select value={selectedPeople.toString()} onValueChange={(value) => onSelect(Number(value))}>
        <SelectTrigger className="select-container">
          <SelectValue placeholder="Wählen Sie die Anzahl der Personen" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default PersonSelector;
