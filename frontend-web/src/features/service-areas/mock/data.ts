import type { CityArea, OperatingHours, RestrictedArea } from '../types';

export const cities: CityArea[] = [
  { id: 'c1', name: 'Quezon City', barangays: ['Socorro', 'San Isidro', 'Bagong Pag-asa', 'Project 6', 'Tandang Sora'], coverageZone: 'Metro Manila North', activeDrivers: 620, status: 'Active' },
  { id: 'c2', name: 'Makati', barangays: ['San Antonio', 'Poblacion', 'Bel-Air', 'Pio del Pilar', 'Palanan'], coverageZone: 'Metro Manila Core', activeDrivers: 480, status: 'Active' },
  { id: 'c3', name: 'Taguig', barangays: ['Bonifacio Global City', 'Bagumbayan', 'Pinagsama', 'Fort Bonifacio'], coverageZone: 'Metro Manila Core', activeDrivers: 410, status: 'Active' },
  { id: 'c4', name: 'Pasig', barangays: ['Bagong Ilog', 'Ortigas', 'San Nicolas', 'Kapitolyo'], coverageZone: 'Metro Manila East', activeDrivers: 355, status: 'Active' },
  { id: 'c5', name: 'Mandaluyong', barangays: ['Plainview', 'Hulo', 'Barangka', 'Malamig'], coverageZone: 'Metro Manila East', activeDrivers: 240, status: 'Active' },
  { id: 'c6', name: 'Pasay', barangays: ['Tramo', 'San Rafael', 'Maricaban', 'Malibay'], coverageZone: 'Metro Manila Core', activeDrivers: 310, status: 'Active' },
  { id: 'c7', name: 'Parañaque', barangays: ['BF Homes', 'Don Galo', 'San Dionisio', 'Baclaran'], coverageZone: 'Metro Manila South', activeDrivers: 290, status: 'Active' },
  { id: 'c8', name: 'Marikina', barangays: ['Marikina Heights', 'San Roque', 'Concepcion Uno', 'Sto. Niño'], coverageZone: 'Metro Manila East', activeDrivers: 175, status: 'Active' },
  { id: 'c9', name: 'Manila', barangays: ['Intramuros', 'Binondo', 'Tondo', 'Ermita'], coverageZone: 'Metro Manila Core', activeDrivers: 330, status: 'Active' },
  { id: 'c10', name: 'Caloocan', barangays: ['Bagong Barrio', 'Grace Park', 'Monumento'], coverageZone: 'Metro Manila North', activeDrivers: 210, status: 'Active' },
  { id: 'c11', name: 'San Juan', barangays: ['Greenhills', 'West Crame'], coverageZone: 'Metro Manila East', activeDrivers: 95, status: 'Active' },
  { id: 'c12', name: 'Cavite City', barangays: ['Caridad', 'San Antonio'], coverageZone: 'Metro Manila South', activeDrivers: 0, status: 'Coming Soon' },
  { id: 'c13', name: 'Antipolo', barangays: ['San Roque', 'Mambugan'], coverageZone: 'Metro Manila East', activeDrivers: 0, status: 'Coming Soon' },
];

export const restrictedAreas: RestrictedArea[] = [
  { id: 'r1', name: 'NAIA Terminals', city: 'Pasay / Parañaque', rule: 'No pickup or drop-off inside terminal premises', schedule: 'Always' },
  { id: 'r2', name: 'EDSA Busway (BLT lines)', city: 'Multiple', rule: 'No riding along busway corridors', schedule: 'Always' },
  { id: 'r3', name: 'Divisoria Market', city: 'Manila', rule: 'No pickup inside market area, meet at fixed points', schedule: 'Weekdays 6:00 PM – 8:00 PM, Saturdays 4:00 PM – 7:00 PM' },
  { id: 'r4', name: 'Malacañang Palace Perimeter', city: 'Manila', rule: 'No pickup/drop-off within 100m of the palace gates', schedule: 'Always' },
  { id: 'r5', name: 'UP Diliman Oval', city: 'Quezon City', rule: 'Restricted during events and athletic meets', schedule: 'Event-based' },
];

export const operatingHours: OperatingHours[] = [
  { day: 'Monday', open: '5:00 AM', close: '11:00 PM', surcharge: true },
  { day: 'Tuesday', open: '5:00 AM', close: '11:00 PM', surcharge: false },
  { day: 'Wednesday', open: '5:00 AM', close: '11:00 PM', surcharge: false },
  { day: 'Thursday', open: '5:00 AM', close: '11:00 PM', surcharge: false },
  { day: 'Friday', open: '5:00 AM', close: '11:59 PM', surcharge: true },
  { day: 'Saturday', open: '5:00 AM', close: '11:59 PM', surcharge: true },
  { day: 'Sunday', open: '6:00 AM', close: '10:00 PM', surcharge: false },
];
