import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker, {
  DateTimePickerEvent,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: Calendar.Event[];
}

const ExpoCalendar: React.FC = () => {
  const [calendars, setCalendars] = useState<Calendar.Calendar[]>([]);
  const [writableCalendars, setWritableCalendars] = useState<Calendar.Calendar[]>([]);
  const [defaultCalendarId, setDefaultCalendarId] = useState<string | null>(null);
  const [events, setEvents] = useState<Calendar.Event[]>([]);
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [eventDetailsModal, setEventDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Calendar.Event | null>(null);

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    (async () => {
      try {
        const granted = await requestCalendarPermissions();
        if (granted) {
          const calendarList = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
          setCalendars(calendarList);

          const writable = calendarList.filter((cal) => cal.allowsModifications);
          setWritableCalendars(writable);

          if (writable.length > 0) {
            setDefaultCalendarId(writable[0].id);
            await getEvents();

            if (writable.length > 1) {
              setCalendarModalVisible(true);
            }
          } else {
            Alert.alert('No writable calendar', 'No calendar available for writing events.');
          }
        } else {
          Alert.alert('Permission Denied', 'We need calendar access to proceed.');
        }
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        Alert.alert('Error', 'An error occurred while fetching calendar data.');
      }
    })();
  }, []);

  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, events]);

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.startDate);
        return (
          eventDate.getFullYear() === current.getFullYear() &&
          eventDate.getMonth() === current.getMonth() &&
          eventDate.getDate() === current.getDate()
        );
      });

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        events: dayEvents,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    setCalendarDays(days);
  };

  const requestCalendarPermissions = async (): Promise<boolean> => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Calendar permission is required to use this feature.');
      return false;
    }
    return true;
  };

  const createEvent = async (): Promise<void> => {
    if (!defaultCalendarId) {
      Alert.alert('Error', 'Please select a calendar first.');
      return;
    }

    const eventDetails = {
      title: title || 'Untitled Event',
      startDate,
      endDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      location,
      notes,
    };

    try {
      const eventId = await Calendar.createEventAsync(defaultCalendarId, eventDetails);
      Alert.alert('Success', `Event created successfully!`);
      setEventModalVisible(false);
      resetForm();
      setTimeout(getEvents, 1000);
    } catch (error: any) {
      Alert.alert('Error creating event', error.message);
    }
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setNotes('');
    setStartDate(new Date());
    setEndDate(new Date());
  };

  const getEvents = async (): Promise<void> => {
    if (!defaultCalendarId) return;

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    try {
      const fetchedEvents = await Calendar.getEventsAsync([defaultCalendarId], start, end);
      setEvents(fetchedEvents);
    } catch (error: any) {
      Alert.alert('Error fetching events', error.message);
    }
  };

  const showAndroidDatePicker = (
    currentDate: Date,
    onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void
  ) => {
    DateTimePickerAndroid.open({
      value: currentDate,
      mode: 'date',
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === 'set' && selectedDate) {
          DateTimePickerAndroid.open({
            value: selectedDate,
            mode: 'time',
            is24Hour: true,
            onChange: (timeEvent, selectedTime) => {
              if (timeEvent.type === 'set' && selectedTime) {
                const combinedDateTime = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
                  selectedTime.getHours(),
                  selectedTime.getMinutes()
                );
                onChange(timeEvent, combinedDateTime);
              }
            },
          });
        }
      },
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDay = (day: CalendarDay, index: number) => {
    const isCurrentDay = isToday(day.date);
    const hasEvents = day.events.length > 0;

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.dayCell,
          !day.isCurrentMonth && styles.otherMonth,
          isCurrentDay && styles.today,
        ]}
        onPress={() => {
          if (hasEvents && day.events[0]) {
            setSelectedEvent(day.events[0]);
            setEventDetailsModal(true);
          }
        }}
      >
        <Text
          style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthText,
            isCurrentDay && styles.todayText,
          ]}
        >
          {day.date.getDate()}
        </Text>
        {hasEvents && (
          <View style={styles.eventIndicatorsContainer}>
            {day.events.slice(0, 2).map((event, eventIndex) => (
              <View
                key={eventIndex}
                style={[
                  styles.eventIndicator,
                  { backgroundColor: getEventColor(eventIndex) }
                ]}
              />
            ))}
            {day.events.length > 2 && (
              <Text style={styles.moreEventsText}>+{day.events.length - 2}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getEventColor = (index: number) => {
    const colors = ['#FFB6C1', '#DDA0DD', '#98FB98', '#F0E68C', '#87CEEB'];
    return colors[index % colors.length];
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>✨ My Calendar</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setEventModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ New Event</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Navigation */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        
        <Text style={styles.monthTitle}>
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekHeader}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => renderCalendarDay(day, index))}
      </View>

      {/* Selected Calendar Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Selected Calendar</Text>
        <Text style={styles.infoText}>
          {defaultCalendarId
            ? calendars.find((c) => c.id === defaultCalendarId)?.title
            : 'None selected'}
        </Text>
        <TouchableOpacity
          style={styles.changeCalendarButton}
          onPress={() => setCalendarModalVisible(true)}
        >
          <Text style={styles.changeCalendarText}>Change Calendar</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Selection Modal */}
      <Modal visible={calendarModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Calendar</Text>
            <ScrollView style={styles.calendarList}>
              {writableCalendars.map((cal) => (
                <TouchableOpacity
                  key={cal.id}
                  style={[
                    styles.calendarOption,
                    cal.id === defaultCalendarId && styles.selectedCalendar
                  ]}
                  onPress={() => {
                    setDefaultCalendarId(cal.id);
                    setCalendarModalVisible(false);
                    setTimeout(getEvents, 500);
                  }}
                >
                  <Text style={styles.calendarOptionText}>
                    {cal.title}
                  </Text>
                  <Text style={styles.calendarSourceText}>
                    {cal.source.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Event Creation Modal */}
      <Modal visible={eventModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create New Event</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Event Title</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter event title"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter location"
                  value={location}
                  onChangeText={setLocation}
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.dateTimeContainer}>
                <Text style={styles.inputLabel}>Start Date & Time</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      showAndroidDatePicker(startDate, (event, date) => {
                        if (date) setStartDate(date);
                      });
                    } else {
                      setShowStartPicker(true);
                    }
                  }}
                >
                  <Text style={styles.dateButtonText}>
                    {startDate.toLocaleDateString()} at {startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && showStartPicker && (
                  <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    display="spinner"
                    onChange={(e, date) => {
                      setShowStartPicker(false);
                      if (date) setStartDate(date);
                    }}
                    style={styles.datePicker}
                  />
                )}
              </View>

              <View style={styles.dateTimeContainer}>
                <Text style={styles.inputLabel}>End Date & Time</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    if (Platform.OS === 'android') {
                      showAndroidDatePicker(endDate, (event, date) => {
                        if (date) setEndDate(date);
                      });
                    } else {
                      setShowEndPicker(true);
                    }
                  }}
                >
                  <Text style={styles.dateButtonText}>
                    {endDate.toLocaleDateString()} at {endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && showEndPicker && (
                  <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    display="spinner"
                    onChange={(e, date) => {
                      setShowEndPicker(false);
                      if (date) setEndDate(date);
                    }}
                    style={styles.datePicker}
                  />
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.notesInput]}
                  placeholder="Add notes or description"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={3}
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={createEvent}
                >
                  <Text style={styles.saveButtonText}>Save Event</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setEventModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Event Details Modal */}
      <Modal visible={eventDetailsModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.eventDetailsContainer}>
            {selectedEvent && (
              <>
                <Text style={styles.eventDetailTitle}>{selectedEvent.title}</Text>
                <Text style={styles.eventDetailTime}>
                  {new Date(selectedEvent.startDate).toLocaleDateString()} at{' '}
                  {new Date(selectedEvent.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
                {selectedEvent.location && (
                  <Text style={styles.eventDetailLocation}>📍 {selectedEvent.location}</Text>
                )}
                {selectedEvent.notes && (
                  <Text style={styles.eventDetailNotes}>{selectedEvent.notes}</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setEventDetailsModal(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FEFEFE',
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: '#2C2C2C',
    letterSpacing: 0.5,
  },
  createButton: {
    backgroundColor: '#E6E6FA',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createButtonText: {
    color: '#6A5ACD',
    fontSize: 14,
    fontWeight: '500',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#F8F8FF',
    marginHorizontal: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  navButtonText: {
    fontSize: 20,
    color: '#6A5ACD',
    fontWeight: '300',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#2C2C2C',
    letterSpacing: 0.5,
  },
  weekHeader: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  dayCell: {
    width: (width - 20) / 7,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: '#FEFEFE',
    position: 'relative',
  },
  otherMonth: {
    opacity: 0.3,
  },
  today: {
    backgroundColor: '#E6E6FA',
    shadowColor: '#6A5ACD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dayText: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '400',
  },
  otherMonthText: {
    color: '#C0C0C0',
  },
  todayText: {
    color: '#6A5ACD',
    fontWeight: '600',
  },
  eventIndicatorsContainer: {
    position: 'absolute',
    bottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  moreEventsText: {
    fontSize: 8,
    color: '#8E8E93',
    marginLeft: 2,
  },
  infoCard: {
    backgroundColor: '#F8F8FF',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6A5ACD',
    marginBottom: 10,
  },
  changeCalendarButton: {
    alignSelf: 'flex-start',
  },
  changeCalendarText: {
    fontSize: 14,
    color: '#8E8E93',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#FEFEFE',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#2C2C2C',
    marginBottom: 25,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  calendarList: {
    maxHeight: 300,
  },
  calendarOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8F8FF',
  },
  selectedCalendar: {
    backgroundColor: '#E6E6FA',
  },
  calendarOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  calendarSourceText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FEFEFE',
    color: '#2C2C2C',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    marginBottom: 20,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEFEFE',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2C2C2C',
  },
  datePicker: {
    backgroundColor: '#F8F8FF',
    borderRadius: 12,
    marginTop: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#E6E6FA',
    paddingVertical: 15,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#6A5ACD',
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  eventDetailsContainer: {
    width: '85%',
    backgroundColor: '#FEFEFE',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  eventDetailTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#2C2C2C',
    marginBottom: 10,
    textAlign: 'center',
  },
  eventDetailTime: {
    fontSize: 16,
    color: '#6A5ACD',
    marginBottom: 8,
  },
  eventDetailLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  eventDetailNotes: {
    fontSize: 14,
    color: '#2C2C2C',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#E6E6FA',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#6A5ACD',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ExpoCalendar;