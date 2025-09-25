import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [modalEvent, setModalEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  const handleSelectSlot = ({ start }) => {
    const title = prompt("Event Title:");
    const location = prompt("Event Location:");
    if (title) {
      const newEvent = {
        id: new Date().getTime(),
        title,
        location,
        start,
        end: start,
        isPast: start < new Date(),
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleSelectEvent = (event) => {
    setModalEvent(event);
    setTitleInput(event.title);
    setModalOpen(true);
  };

  const saveEvent = () => {
    setEvents(events.map((ev) => (ev.id === modalEvent.id ? { ...ev, title: titleInput } : ev)));
    setModalOpen(false);
  };

  const deleteEvent = () => {
    setEvents(events.filter((ev) => ev.id !== modalEvent.id));
    setModalOpen(false);
  };

  const filteredEvents = events.filter((ev) => {
    if (filter === "Past") return ev.isPast;
    if (filter === "Upcoming") return !ev.isPast;
    return true;
  });

  return (
    <div style={{ margin: "20px" }}>
      <div style={{ marginBottom: "10px" }}>
        <button className="btn" onClick={() => setFilter("All")}>All</button>
        <button className="btn" onClick={() => setFilter("Past")}>Past</button>
        <button className="btn" onClick={() => setFilter("Upcoming")}>Upcoming</button>
      </div>

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={(event) => ({
          className: event.isPast ? "past-event" : "upcoming-event",
        })}
      />

      {/* Custom Modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%",
          height: "100%", background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px", width: 300 }}>
            <h3>Edit Event</h3>
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Event Title"
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={saveEvent} style={{ marginRight: 5, background: "#4caf50", color: "white", padding: "5px 10px" }}>Save</button>
              <button onClick={deleteEvent} style={{ background: "#f44336", color: "white", padding: "5px 10px" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
