import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, User, BookOpen, AlertTriangle, Plus, X, Download, Upload, Trash2, ChevronDown } from 'lucide-react';

const TUPECESchedulingSystem = () => {
  const scheduleTableRef = useRef(null);
  
  // ===== LOCALSTORAGE FUNCTIONS =====
  
  // Save schedules to localStorage
  const saveSchedulesToStorage = (schedulesData) => {
    try {
      localStorage.setItem('tupEceSchedules', JSON.stringify(schedulesData));
      console.log('✅ Schedules saved to localStorage');
    } catch (error) {
      console.error('❌ Failed to save schedules:', error);
      alert('Failed to save schedules. Your browser might not support local storage.');
    }
  };

  // Load schedules from localStorage
  const loadSchedulesFromStorage = () => {
    try {
      const saved = localStorage.getItem('tupEceSchedules');
      if (saved) {
        const parsedSchedules = JSON.parse(saved);
        console.log('✅ Schedules loaded from localStorage');
        return parsedSchedules;
      }
    } catch (error) {
      console.error('❌ Failed to load schedules:', error);
    }
    
    // Return default schedules if loading fails or no data exists
    console.log('📝 Using default schedules');
    return [
      {
        id: 1,
        section: 'ECE 3A',
        subject: 'PECEE 6',
        room: 'E34',
        faculty: 'TMA',
        day: 'Monday',
        startTime: '07:00',
        endTime: '10:00'
      },
      {
        id: 2,
        section: 'ECE 2B',
        subject: 'ACEECE 4',
        room: 'E20',
        faculty: 'EAG',
        day: 'Monday',
        startTime: '10:00',
        endTime: '11:30'
      }
    ];
  };

  // Export schedules as JSON file
  const exportSchedulesToFile = () => {
    const dataStr = JSON.stringify(schedules, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `tup-ece-schedules-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('📁 Schedule exported successfully!');
  };

  // Import schedules from JSON file
  const importSchedulesFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchedules = JSON.parse(e.target.result);
        if (Array.isArray(importedSchedules)) {
          setSchedules(importedSchedules);
          alert(`✅ Successfully imported ${importedSchedules.length} schedules.`);
        } else {
          alert('❌ Invalid file format. Please select a valid JSON file.');
        }
      } catch (error) {
        alert('❌ Error reading file. Please check the file format.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  // Clear all saved data
  const clearStoredData = () => {
    if (confirm('⚠️ Are you sure you want to clear all saved schedule data? This cannot be undone.')) {
      localStorage.removeItem('tupEceSchedules');
      setSchedules(loadSchedulesFromStorage());
      alert('🗑️ All schedule data has been cleared.');
    }
  };

  // ===== STATE VARIABLES =====
  
  // Updated to use localStorage
  const [schedules, setSchedules] = useState(() => loadSchedulesFromStorage());

  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'finder'
  const [viewMode, setViewMode] = useState('section'); // 'section', 'room', 'faculty'
  const [selectedFilter, setSelectedFilter] = useState('');
  const [formData, setFormData] = useState({
    section: '',
    subject: '',
    room: '',
    faculty: '',
    day: '',
    startTime: '',
    endTime: ''
  });
  const [showCustomRoom, setShowCustomRoom] = useState(false);
  const [customRoom, setCustomRoom] = useState('');
  const [conflicts, setConflicts] = useState([]);

  // Schedule Finder state
  const [showFinderForm, setShowFinderForm] = useState(false);
  const [finderData, setFinderData] = useState({
    section: '',
    subject: '',
    hours: '',
    faculty: ''
  });
  const [finderResults, setFinderResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-save schedules whenever they change
  useEffect(() => {
    saveSchedulesToStorage(schedules);
  }, [schedules]);

  const predefinedRooms = ['E34', 'COE23', 'COE52', 'COE43', 'E20'];

  // Print-based PDF export (reliable browser method)
  const printSchedule = () => {
    try {
      // Get current filter info
      let filterInfo = '';
      if (selectedFilter) {
        filterInfo = `${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}: ${selectedFilter}`;
      } else {
        filterInfo = 'All Schedules';
      }

      // Create print content
      const element = scheduleTableRef.current;
      if (!element) {
        alert('Schedule table not found');
        return;
      }

      // Clone the table
      const tableClone = element.cloneNode(true);
      
      // Remove delete buttons
      const deleteButtons = tableClone.querySelectorAll('button');
      deleteButtons.forEach(btn => btn.remove());
      
      // Remove hover classes
      const groupElements = tableClone.querySelectorAll('.group');
      groupElements.forEach(el => el.classList.remove('group'));

      // Create print window content
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>TUP ECE Schedule - ${filterInfo}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: A4 landscape; margin: 0.5in; }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #dc2626;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #dc2626;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .header p {
              color: #666;
              margin: 5px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
            }
            th, td {
              border: 1px solid #333;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
              text-align: center;
            }
            .time-cell {
              background-color: #f9fafb;
              font-weight: bold;
            }
            .schedule-item {
              background-color: #fef2f2 !important;
              border: 1px solid #dc2626 !important;
              padding: 4px !important;
              font-size: 8px !important;
              line-height: 1.2;
            }
            .schedule-item div {
              margin: 1px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TUP ECE Class Schedule</h1>
            <p>Technological University of the Philippines - ECE Department</p>
            <p>Filter: ${filterInfo}</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
          ${tableClone.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          </script>
        </body>
        </html>
      `;

      // Open print window
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();

    } catch (error) {
      console.error('Print failed:', error);
      alert('Print function failed. Please try again.');
    }
  };

  // Schedule Finder Algorithm
  const findAvailableSlots = () => {
    setIsSearching(true);
    setHasSearched(true);
    const totalHours = parseFloat(finderData.hours);
    const totalSlots = totalHours * 2; // Convert hours to 30-min slots
    
    if (!finderData.section || !finderData.subject || !finderData.faculty || !totalHours) {
      alert('Please fill in all fields');
      setIsSearching(false);
      return;
    }

    const results = [];
    
    // Generate possible session patterns
    const patterns = generateSessionPatterns(totalSlots);
    
    // For each pattern, try to find available slots
    patterns.forEach(pattern => {
      const patternResults = findSlotsForPattern(pattern);
      results.push(...patternResults);
    });

    // Sort results by preference (fewer sessions first, then by total span)
    results.sort((a, b) => {
      if (a.sessions.length !== b.sessions.length) {
        return a.sessions.length - b.sessions.length;
      }
      return a.totalSpanDays - b.totalSpanDays;
    });

    setFinderResults(results.slice(0, 10)); // Limit to top 10 results
    setIsSearching(false);
  };

  // Generate different session patterns (e.g., 6 slots = [6], [3,3], [2,2,2], etc.)
  const generateSessionPatterns = (totalSlots) => {
    const patterns = [];
    
    // Single session
    if (totalSlots <= 12) { // Max 6 hours per session
      patterns.push([totalSlots]);
    }
    
    // Two sessions
    if (totalSlots >= 2) {
      for (let i = 1; i < totalSlots; i++) {
        if (i <= 12 && (totalSlots - i) <= 12) {
          patterns.push([i, totalSlots - i]);
        }
      }
    }
    
    // Three sessions
    if (totalSlots >= 3) {
      for (let i = 1; i <= Math.floor(totalSlots/3); i++) {
        for (let j = 1; j <= Math.floor((totalSlots-i)/2); j++) {
          const k = totalSlots - i - j;
          if (k > 0 && k <= 12 && i <= 12 && j <= 12) {
            patterns.push([i, j, k]);
          }
        }
      }
    }
    
    return patterns;
  };

  // Find slots for a specific pattern
  const findSlotsForPattern = (pattern) => {
    const results = [];
    
    // Try different combinations of days and rooms
    const daysCombinations = generateDaysCombinations(pattern.length);
    
    daysCombinations.forEach(daysCombo => {
      predefinedRooms.forEach(room => {
        const sessions = [];
        let isValidPattern = true;
        
        pattern.forEach((sessionSlots, index) => {
          const day = daysCombo[index];
          const sessionHours = sessionSlots / 2;
          
          // Find available time slot for this session
          const availableSlot = findAvailableTimeSlot(day, sessionSlots, room);
          
          if (availableSlot) {
            sessions.push({
              day,
              startTime: availableSlot.startTime,
              endTime: availableSlot.endTime,
              room,
              hours: sessionHours
            });
          } else {
            isValidPattern = false;
          }
        });
        
        if (isValidPattern && sessions.length === pattern.length) {
          const totalSpanDays = Math.max(...sessions.map(s => days.indexOf(s.day))) - 
                               Math.min(...sessions.map(s => days.indexOf(s.day))) + 1;
          
          results.push({
            sessions,
            totalHours: parseFloat(finderData.hours),
            totalSpanDays,
            pattern: pattern.map(p => p/2).join(' + ') + ' hours',
            searchData: { ...finderData } // Store the original search data
          });
        }
      });
    });
    
    return results;
  };

  // Generate combinations of days for sessions
  const generateDaysCombinations = (numSessions) => {
    const combinations = [];
    
    if (numSessions === 1) {
      days.forEach(day => combinations.push([day]));
    } else if (numSessions === 2) {
      for (let i = 0; i < days.length; i++) {
        for (let j = i; j < days.length; j++) {
          if (i === j) {
            combinations.push([days[i], days[i]]);
          } else {
            combinations.push([days[i], days[j]]);
          }
        }
      }
    } else if (numSessions === 3) {
      for (let i = 0; i < days.length; i++) {
        for (let j = i; j < days.length; j++) {
          for (let k = j; k < days.length; k++) {
            combinations.push([days[i], days[j], days[k]]);
          }
        }
      }
    }
    
    return combinations;
  };

  // Find available time slot for a session
  const findAvailableTimeSlot = (day, requiredSlots, room) => {
    const sessionDurationMinutes = requiredSlots * 30;
    
    for (let i = 0; i <= timeSlots.length - requiredSlots; i++) {
      const startTime = timeSlots[i];
      const endTimeIndex = i + requiredSlots;
      
      if (endTimeIndex >= timeSlots.length) break;
      
      const endTime = timeSlots[endTimeIndex];
      let isAvailable = true;
      
      // Check each 30-min slot in this time range
      for (let j = i; j < endTimeIndex; j++) {
        const slotTime = timeSlots[j];
        
        // Check if any existing schedule conflicts
        const conflict = schedules.find(schedule => {
          if (schedule.day !== day) return false;
          
          const schedStart = timeToMinutes(schedule.startTime);
          const schedEnd = timeToMinutes(schedule.endTime);
          const slotStart = timeToMinutes(slotTime);
          const slotEnd = slotStart + 30;
          
          const hasTimeOverlap = slotStart < schedEnd && slotEnd > schedStart;
          
          if (hasTimeOverlap) {
            // Check for conflicts
            return schedule.room === room || 
                   schedule.faculty === finderData.faculty || 
                   schedule.section === finderData.section;
          }
          
          return false;
        });
        
        if (conflict) {
          isAvailable = false;
          break;
        }
      }
      
      if (isAvailable) {
        return { startTime, endTime };
      }
    }
    
    return null;
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
    '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // Get unique values for filters
  const getSections = () => [...new Set(schedules.map(s => s.section))];
  const getRooms = () => [...new Set(schedules.map(s => s.room))];
  const getFaculty = () => [...new Set(schedules.map(s => s.faculty))];

  // Convert time string to minutes since midnight
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Check for conflicts
  const checkConflicts = (newSchedule, excludeId = null) => {
    const conflicts = [];
    
    schedules.forEach(existing => {
      if (excludeId && existing.id === excludeId) return;
      
      if (existing.day === newSchedule.day) {
        const existingStart = timeToMinutes(existing.startTime);
        const existingEnd = timeToMinutes(existing.endTime);
        const newStart = timeToMinutes(newSchedule.startTime);
        const newEnd = timeToMinutes(newSchedule.endTime);
        
        // Check for time overlap
        const hasTimeOverlap = (newStart < existingEnd && newEnd > existingStart);
        
        if (hasTimeOverlap) {
          // Room conflict
          if (existing.room === newSchedule.room) {
            conflicts.push(`Room conflict: ${existing.room} is already occupied by ${existing.section} (${existing.subject}) from ${existing.startTime}-${existing.endTime}`);
          }
          
          // Faculty conflict
          if (existing.faculty === newSchedule.faculty) {
            conflicts.push(`Faculty conflict: ${existing.faculty} is already teaching ${existing.section} (${existing.subject}) from ${existing.startTime}-${existing.endTime}`);
          }
          
          // Section conflict
          if (existing.section === newSchedule.section) {
            conflicts.push(`Section conflict: ${existing.section} already has ${existing.subject} with ${existing.faculty} from ${existing.startTime}-${existing.endTime}`);
          }
        }
      }
    });
    
    return conflicts;
  };

  // Handle form submission
  const handleSubmit = () => {
    const finalRoom = showCustomRoom ? customRoom : formData.room;
    
    if (!formData.section || !formData.subject || !finalRoom || !formData.faculty || 
        !formData.day || !formData.startTime || !formData.endTime) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      alert('End time must be after start time');
      return;
    }

    const scheduleToCheck = { ...formData, room: finalRoom };
    const detectedConflicts = checkConflicts(scheduleToCheck);
    
    if (detectedConflicts.length > 0) {
      setConflicts(detectedConflicts);
      return;
    }

    const newSchedule = {
      id: Date.now(),
      ...scheduleToCheck
    };

    setSchedules([...schedules, newSchedule]);
    setFormData({
      section: '',
      subject: '',
      room: '',
      faculty: '',
      day: '',
      startTime: '',
      endTime: ''
    });
    setShowCustomRoom(false);
    setCustomRoom('');
    setShowForm(false);
    setConflicts([]);
  };

  // Delete schedule
  const deleteSchedule = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Filter schedules based on view mode and selected filter
  const getFilteredSchedules = () => {
    if (!selectedFilter) return schedules;
    
    switch (viewMode) {
      case 'section':
        return schedules.filter(s => s.section === selectedFilter);
      case 'room':
        return schedules.filter(s => s.room === selectedFilter);
      case 'faculty':
        return schedules.filter(s => s.faculty === selectedFilter);
      default:
        return schedules;
    }
  };

  // Get schedule for specific day and time
  const getScheduleForSlot = (day, time) => {
    const filtered = getFilteredSchedules();
    return filtered.find(schedule => {
      const scheduleStart = timeToMinutes(schedule.startTime);
      const scheduleEnd = timeToMinutes(schedule.endTime);
      const slotTime = timeToMinutes(time);
      
      return schedule.day === day && slotTime >= scheduleStart && slotTime < scheduleEnd;
    });
  };

  // Calculate schedule duration in hours
  const getScheduleDuration = (schedule) => {
    const start = timeToMinutes(schedule.startTime);
    const end = timeToMinutes(schedule.endTime);
    return (end - start) / 60;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">TUP ECE Class Scheduler</h1>
                <p className="text-red-100 mt-1">TUP ECE Schedule Management System</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* Data Management Dropdown */}
              <div className="relative group">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Data</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={exportSchedulesToFile}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export to File</span>
                    </button>
                    
                    <label className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Import from File</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importSchedulesFromFile}
                        className="hidden"
                      />
                    </label>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <button
                      onClick={clearStoredData}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All Data</span>
                    </button>
                  </div>
                </div>
              </div>

              {activeTab === 'schedule' && (
                <button
                  onClick={printSchedule}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Print Schedule</span>
                </button>
              )}
              
              <button
                onClick={() => setShowForm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Class</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Schedule Management
              </button>
              <button
                onClick={() => setActiveTab('finder')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'finder'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Schedule Finder
              </button>
            </nav>
          </div>

          {activeTab === 'schedule' && (
            <div>
              {/* View Controls */}
              <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">View by:</span>
                    <select
                      value={viewMode}
                      onChange={(e) => {
                        setViewMode(e.target.value);
                        setSelectedFilter('');
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="section">Section</option>
                      <option value="room">Room</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Filter:</span>
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select {viewMode}</option>
                      {viewMode === 'section' && getSections().map(section => (
                        <option key={section} value={section}>{section}</option>
                      ))}
                      {viewMode === 'room' && getRooms().map(room => (
                        <option key={room} value={room}>{room}</option>
                      ))}
                      {viewMode === 'faculty' && getFaculty().map(faculty => (
                        <option key={faculty} value={faculty}>{faculty}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current View Indicator */}
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                  <strong>Current View:</strong> {selectedFilter || 'All Schedules'}
                  {selectedFilter && ` (${viewMode})`}
                </div>
              </div>

              {/* Schedule Grid */}
              <div className="overflow-x-auto">
                <table ref={scheduleTableRef} className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Time</th>
                      {days.map(day => (
                        <th key={day} className="border border-gray-300 p-3 text-center font-semibold min-w-48">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time}>
                        <td className="border border-gray-300 p-3 font-medium bg-gray-50">
                          {time}
                        </td>
                        {days.map(day => {
                          const schedule = getScheduleForSlot(day, time);
                          return (
                            <td key={`${day}-${time}`} className="border border-gray-300 p-1 h-12 relative">
                              {schedule && (
                                <div className="bg-red-100 border border-red-300 rounded p-2 text-xs h-full relative group">
                                  <div className="font-semibold text-red-800">{schedule.subject}</div>
                                  <div className="text-red-600">{schedule.section}</div>
                                  <div className="text-red-600">{schedule.room}</div>
                                  <div className="text-red-600">{schedule.faculty}</div>
                                  <div className="text-xs text-red-500">{schedule.startTime}-{schedule.endTime}</div>
                                  <button
                                    onClick={() => deleteSchedule(schedule.id)}
                                    className="absolute top-1 right-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'finder' && (
            <div>
              {/* Schedule Finder Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Schedule Finder</h2>
                  <p className="text-gray-600 mt-1">Find available time slots for your classes</p>
                </div>
                <div className="flex space-x-2">
                  {finderResults.length > 0 && (
                    <button
                      onClick={() => {
                        setFinderResults([]);
                        setFinderData({ section: '', subject: '', hours: '', faculty: '' });
                        setHasSearched(false);
                      }}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Clear Results</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowFinderForm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Find Slots</span>
                  </button>
                </div>
              </div>

              {/* Finder Results */}
              {finderResults.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-800">Available Options</h3>
                    {finderResults.length > 0 && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{finderResults[0].searchData.section}</span> • 
                        <span className="ml-1">{finderResults[0].searchData.subject}</span> • 
                        <span className="ml-1">{finderResults[0].searchData.faculty}</span> • 
                        <span className="ml-1">{finderResults[0].totalHours} hours</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {finderResults.map((result, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                              Option {index + 1}
                            </span>
                            <span className="text-sm text-gray-600">
                              {result.pattern} • {result.sessions.length} session{result.sessions.length > 1 ? 's' : ''}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              // Add all sessions to the main schedule
                              result.sessions.forEach(session => {
                                const newSchedule = {
                                  id: Date.now() + Math.random(),
                                  section: result.searchData.section,
                                  subject: result.searchData.subject,
                                  room: session.room,
                                  faculty: result.searchData.faculty,
                                  day: session.day,
                                  startTime: session.startTime,
                                  endTime: session.endTime
                                };
                                setSchedules(prev => [...prev, newSchedule]);
                              });
                              setActiveTab('schedule');
                              setFinderResults([]);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Use This Option
                          </button>
                        </div>
                        <div className="grid gap-2">
                          {result.sessions.map((session, sessionIndex) => (
                            <div key={sessionIndex} className="flex items-center space-x-4 text-sm">
                              <span className="font-medium text-red-800">{session.day}</span>
                              <span className="text-gray-600">{session.startTime} - {session.endTime}</span>
                              <span className="text-gray-600">{session.room}</span>
                              <span className="text-red-700">({session.hours} hour{session.hours !== 1 ? 's' : ''})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSearching && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  <p className="mt-2 text-gray-600">Searching for available slots...</p>
                </div>
              )}

              {!isSearching && finderResults.length === 0 && hasSearched && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No available slots found for the specified requirements.</p>
                  <p className="text-sm mt-1">Try reducing the hours or selecting different parameters.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Finder Form Modal */}
      {showFinderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Find Available Slots
              </h3>
              <button
                onClick={() => {
                  setShowFinderForm(false);
                  // Only clear form data if there are no results to show
                  if (finderResults.length === 0) {
                    setFinderData({ section: '', subject: '', hours: '', faculty: '' });
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Section
                </label>
                <input
                  type="text"
                  value={finderData.section}
                  onChange={(e) => setFinderData({...finderData, section: e.target.value})}
                  placeholder="e.g. BSECE 3A"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Subject
                </label>
                <input
                  type="text"
                  value={finderData.subject}
                  onChange={(e) => setFinderData({...finderData, subject: e.target.value})}
                  placeholder="e.g. Digital Signal Processing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Total Hours Needed
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="10"
                  value={finderData.hours}
                  onChange={(e) => setFinderData({...finderData, hours: e.target.value})}
                  placeholder="e.g. 3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Enter hours in 0.5 increments (0.5, 1, 1.5, 2, etc.)</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <User className="w-4 h-4 inline mr-1" />
                  Faculty
                </label>
                <input
                  type="text"
                  value={finderData.faculty}
                  onChange={(e) => setFinderData({...finderData, faculty: e.target.value})}
                  placeholder="e.g. Dr. Maria Santos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <strong>How it works:</strong> The system will search for available time slots across the week
                  that can accommodate your total hours. It may suggest splitting sessions across multiple days
                  if needed (e.g., 3 hours might become 1.5 hours on Monday + 1.5 hours on Wednesday).
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={findAvailableSlots}
                  disabled={isSearching}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Find Slots</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowFinderForm(false);
                    // Only clear form data if there are no results to show
                    if (finderResults.length === 0) {
                      setFinderData({ section: '', subject: '', hours: '', faculty: '' });
                    }
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Add New Class
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setConflicts([]);
                  setShowCustomRoom(false);
                  setCustomRoom('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conflict Alerts */}
            {conflicts.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                  <span className="font-medium text-red-800">Scheduling Conflicts Detected:</span>
                </div>
                {conflicts.map((conflict, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">{conflict}</div>
                ))}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Users className="w-4 h-4 inline mr-1" />
                    Section
                  </label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    placeholder="e.g. BSECE 3A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Digital Signal Processing"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Room
                  </label>
                  <select
                    value={showCustomRoom ? 'custom' : formData.room}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomRoom(true);
                        setFormData({...formData, room: ''});
                      } else {
                        setShowCustomRoom(false);
                        setCustomRoom('');
                        setFormData({...formData, room: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Room</option>
                    {predefinedRooms.map(room => (
                      <option key={room} value={room}>{room}</option>
                    ))}
                    <option value="custom">+ Add New Room</option>
                  </select>
                  
                  {showCustomRoom && (
                    <input
                      type="text"
                      value={customRoom}
                      onChange={(e) => setCustomRoom(e.target.value)}
                      placeholder="Enter new room name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mt-2"
                    />
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 inline mr-1" />
                    Faculty
                  </label>
                  <input
                    type="text"
                    value={formData.faculty}
                    onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                    placeholder="e.g. Dr. Maria Santos"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Day
                </label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Day</option>
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Start Time
                  </label>
                  <select
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select Start Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    End Time
                  </label>
                  <select
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select End Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Class</span>
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setConflicts([]);
                    setShowCustomRoom(false);
                    setCustomRoom('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TUPECESchedulingSystem;