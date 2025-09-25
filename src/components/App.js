// App.js
import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import "../styles/App.css"

const Modal = ({ children, open, onClose }) => {
  if (!open) return null;
  return (
    <div className="mm-popup" onClick={onClose}>
      <div className="mm-popup__box" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

const localizer = momentLocalizer(moment);

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem('events_v1');
      return raw ? JSON.parse(raw).map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) })) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('events_v1', JSON.stringify(events));
  }, [events]);

  function handleSelectSlot({ start }) {
    setSelectedDate(start);
  }

  function openCreatePopup() {
    setShowCreateModal(true);
  }

  function saveNewEvent({ title, location }) {
    if (!title) return;
    const ev = {
      id: Date.now(),
      title,
      location,
      start: selectedDate || new Date(),
      end: selectedDate || new Date(),
    };
    setEvents(prev => [...prev, ev]);
    setShowCreateModal(false);
    setSelectedDate(null);
  }

  function handleSelectEvent(ev) {
    setEditingEvent(ev);
    setShowEditModal(true);
  }

  function saveEditedEvent(changes) {
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...changes } : e));
    setShowEditModal(false);
    setEditingEvent(null);
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
    setShowEditModal(false);
    setEditingEvent(null);
  }

  function eventStyleGetter(event) {
    const start = new Date(event.start);
    const bg = start < new Date() ? 'rgb(222, 105, 135)' : 'rgb(140, 189, 76)';
    return { style: { backgroundColor: bg, border: 'none', color: 'white', padding: '2px 4px' } };
  }

  const displayedEvents = events.filter(e => {
    if (filter === 'all') return true;
    const isPast = new Date(e.start) < new Date();
    return filter === 'past' ? isPast : !isPast;
  });

  const [titleInput, setTitleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [editTitleInput, setEditTitleInput] = useState('');
  const [editLocationInput, setEditLocationInput] = useState('');

  useEffect(() => {
    if (showCreateModal) {
      setTitleInput('');
      setLocationInput('');
    }
  }, [showCreateModal]);

  useEffect(() => {
    if (editingEvent) {
      setEditTitleInput(editingEvent.title || '');
      setEditLocationInput(editingEvent.location || '');
    }
  }, [editingEvent]);

  return (
    <div className="app-container">
      <h2>Event Tracker</h2>

      <div className="filter-buttons">
        <button className="btn" onClick={() => setFilter('all')}>All</button>
        <button className="btn" onClick={() => setFilter('past')}>Past</button>
        <button className="btn" onClick={() => setFilter('upcoming')}>Upcoming</button>
      </div>

      <div className="calendar-container">
        <Calendar
          selectable
          localizer={localizer}
          events={displayedEvents}
          startAccessor="start"
          endAccessor="end"
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={{ month: true }}
        />
      </div>

      {selectedDate && (
        <div className="action-buttons">
           <button className="btn" onClick={openCreatePopup}>Add Event</button>
           </div>
      )}
          

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <div className="modal-content">
          <h3>Create Event</h3>
          <input placeholder="Event Title" value={titleInput} onChange={e => setTitleInput(e.target.value)} />
          <input placeholder="Event Location" value={locationInput} onChange={e => setLocationInput(e.target.value)} />

          <div className="mm-popup__box__footer">
            <div className="mm-popup__box__footer__right-space">
              <button className="mm-popup__btn" onClick={() => saveNewEvent({ title: titleInput, location: locationInput })}>Save</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <div className="modal-content">
          <h3>Edit Event</h3>
          <input placeholder="Event Title" value={editTitleInput} onChange={e => setEditTitleInput(e.target.value)} />
          <input placeholder="Event Location" value={editLocationInput} onChange={e => setEditLocationInput(e.target.value)} />

          <div className="mm-popup__box__footer edit-footer">
            <button className="mm-popup__btn--danger" onClick={() => deleteEvent(editingEvent?.id)}>Delete</button>
            <div className="mm-popup__box__footer__right-space">
              <button className="mm-popup__btn--info" onClick={() => saveEditedEvent({ title: editTitleInput, location: editLocationInput })}>Save</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

