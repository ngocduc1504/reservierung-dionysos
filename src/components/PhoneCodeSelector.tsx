import React, { useState } from 'react';
import { Check, ChevronDown, Globe, Search } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Define interface for country codes
interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

// Process country codes to avoid duplicates by merging countries with same code
const countryCodes: CountryCode[] = [
  // Europe
  { code: '+49', country: 'Deutschland', flag: '🇩🇪' },
  { code: '+43', country: 'Österreich', flag: '🇦🇹' },
  { code: '+41', country: 'Schweiz', flag: '🇨🇭' },
  { code: '+33', country: 'Frankreich', flag: '🇫🇷' },
  { code: '+31', country: 'Niederlande', flag: '🇳🇱' },
  { code: '+39', country: 'Italien', flag: '🇮🇹' },
  { code: '+34', country: 'Spanien', flag: '🇪🇸' },
  { code: '+44', country: 'Großbritannien', flag: '🇬🇧' },
  { code: '+32', country: 'Belgien', flag: '🇧🇪' },
  { code: '+45', country: 'Dänemark', flag: '🇩🇰' },
  { code: '+46', country: 'Schweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norwegen', flag: '🇳🇴' },
  { code: '+358', country: 'Finnland', flag: '🇫🇮' },
  { code: '+48', country: 'Polen', flag: '🇵🇱' },
  { code: '+420', country: 'Tschechien', flag: '🇨🇿' },
  { code: '+36', country: 'Ungarn', flag: '🇭🇺' },
  { code: '+30', country: 'Griechenland', flag: '🇬🇷' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+353', country: 'Irland', flag: '🇮🇪' },
  { code: '+352', country: 'Luxemburg', flag: '🇱🇺' },
  { code: '+40', country: 'Rumänien', flag: '🇷🇴' },
  { code: '+359', country: 'Bulgarien', flag: '🇧🇬' },
  { code: '+385', country: 'Kroatien', flag: '🇭🇷' },
  { code: '+386', country: 'Slowenien', flag: '🇸🇮' },
  { code: '+421', country: 'Slowakei', flag: '🇸🇰' },
  { code: '+371', country: 'Lettland', flag: '🇱🇻' },
  { code: '+372', country: 'Estland', flag: '🇪🇪' },
  { code: '+370', country: 'Litauen', flag: '🇱🇹' },
  { code: '+354', country: 'Island', flag: '🇮🇸' },
  { code: '+381', country: 'Serbien', flag: '🇷🇸' },
  
  // North America
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+1', country: 'Kanada', flag: '🇨🇦' },
  { code: '+52', country: 'Mexiko', flag: '🇲🇽' },
  
  // South America
  { code: '+55', country: 'Brasilien', flag: '🇧🇷' },
  { code: '+54', country: 'Argentinien', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Kolumbien', flag: '🇨🇴' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  
  // Asia
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'Indien', flag: '🇮🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'Südkorea', flag: '🇰🇷' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+62', country: 'Indonesien', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+63', country: 'Philippinen', flag: '🇵🇭' },
  { code: '+65', country: 'Singapur', flag: '🇸🇬' },
  { code: '+852', country: 'Hongkong', flag: '🇭🇰' },
  { code: '+886', country: 'Taiwan', flag: '����🇼' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+971', country: 'Vereinigte Arabische Emirate', flag: '🇦🇪' },
  { code: '+966', country: 'Saudi-Arabien', flag: '🇸🇦' },
  { code: '+90', country: 'Türkei', flag: '🇹🇷' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '+880', country: 'Bangladesch', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  
  // Africa
  { code: '+20', country: 'Ägypten', flag: '🇪🇬' },
  { code: '+27', country: 'Südafrika', flag: '🇿🇦' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'Kenia', flag: '🇰🇪' },
  { code: '+212', country: 'Marokko', flag: '🇲🇦' },
  { code: '+213', country: 'Algerien', flag: '🇩🇿' },
  { code: '+216', country: 'Tunesien', flag: '🇹🇳' },
  { code: '+251', country: 'Äthiopien', flag: '🇪🇹' },
  { code: '+255', country: 'Tansania', flag: '🇹🇿' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  
  // Oceania
  { code: '+61', country: 'Australien', flag: '🇦🇺' },
  { code: '+64', country: 'Neuseeland', flag: '🇳🇿' },
  { code: '+675', country: 'Papua-Neuguinea', flag: '🇵🇬' },
  { code: '+679', country: 'Fidschi', flag: '🇫🇯' },
];

// Process country codes to group countries with the same code
const processCountryCodes = () => {
  const codeMap = new Map<string, CountryCode[]>();
  
  for (const country of countryCodes) {
    if (!codeMap.has(country.code)) {
      codeMap.set(country.code, []);
    }
    codeMap.get(country.code)!.push(country);
  }
  
  // Create a list with unique codes, preferring Germany if available
  const uniqueCodes: CountryCode[] = [];
  
  codeMap.forEach((countries, code) => {
    // If multiple countries with same code, sort them
    countries.sort((a, b) => {
      // Prioritize Germany
      if (a.country === 'Deutschland') return -1;
      if (b.country === 'Deutschland') return 1;
      return a.country.localeCompare(b.country);
    });
    
    // Create a combined entry if multiple countries
    if (countries.length > 1) {
      const primary = countries[0];
      let combinedCountry = primary.country;
      if (countries.length > 1) {
        combinedCountry += ` +${countries.length - 1}`;
      }
      
      uniqueCodes.push({
        code: primary.code,
        country: combinedCountry,
        flag: primary.flag
      });
    } else {
      uniqueCodes.push(countries[0]);
    }
  });
  
  return uniqueCodes.sort((a, b) => a.country.localeCompare(b.country));
};

const sortedUniqueCodes = processCountryCodes();

interface PhoneCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const PhoneCodeSelector = ({ value, onChange }: PhoneCodeSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Find the selected country
  const selectedCountry = sortedUniqueCodes.find(c => c.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between border-r-0 rounded-r-none flex-shrink-0"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg flex-shrink-0">
              {selectedCountry?.flag || <Globe className="h-4 w-4" />}
            </span>
            <span className="text-base font-normal">{value || "+49"}</span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Land oder Code suchen..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>Keine Ergebnisse gefunden</CommandEmpty>
            <CommandGroup>
              {sortedUniqueCodes.map((country) => {
                const isFiltered = 
                  searchQuery && 
                  !country.country.toLowerCase().includes(searchQuery.toLowerCase()) && 
                  !country.code.toLowerCase().includes(searchQuery.toLowerCase());
                
                if (isFiltered) return null;
                
                return (
                  <CommandItem
                    key={`${country.code}-${country.country}`}
                    value={`${country.code}-${country.country}`}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <span className="text-base flex-shrink-0">{country.flag}</span>
                      <span className="font-medium">{country.code}</span>
                      <span className="text-muted-foreground text-xs truncate">
                        {country.country}
                      </span>
                      {country.code === value && (
                        <Check className="h-4 w-4 ml-auto text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PhoneCodeSelector;
