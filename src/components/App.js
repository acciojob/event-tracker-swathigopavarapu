import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/App.css";

const localizer = momentLocalizer(moment);

const App = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");

  // Create Event Modal state
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [newEventDate, setNewEventDate] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");

  // Edit/Delete Modal state
  const [modalEvent, setModalEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");

  // Handle selecting a calendar date (for creating new event)
  const handleSelectSlot = ({ start }) => {
    setNewEventDate(start);
    setNewTitle("");
    setNewLocation("");
    setCreateEventOpen(true);
  };

  // Handle selecting an existing event (edit/delete)
  const handleSelectEvent = (event) => {
    setModalEvent(event);
    setTitleInput(event.title);
    setModalOpen(true);
  };

  // Save edited event
  const saveEvent = () => {
    setEvents(
      events.map((ev) =>
        ev.id === modalEvent.id ? { ...ev, title: titleInput } : ev
      )
    );
    setModalOpen(false);
  };

  // Delete event
  const deleteEvent = () => {
    setEvents(events.filter((ev) => ev.id !== modalEvent.id));
    setModalOpen(false);
  };

  // Filter events based on button
  const filteredEvents = events.filter((ev) => {
    if (filter === "Past") return ev.isPast;
    if (filter === "Upcoming") return !ev.isPast;
    return true;
  });

  return (
    <div style={{ margin: "20px" }}>
      {/* Filter Buttons */}
      <div style={{ marginBottom: "10px" }}>
        <button className="btn" onClick={() => setFilter("All")}>
          All
        </button>
        <button className="btn" onClick={() => setFilter("Past")}>
          Past
        </button>
        <button className="btn" onClick={() => setFilter("Upcoming")}>
          Upcoming
        </button>
      </div>

      {/* Calendar */}
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

      {/* Create Event Modal */}
      {createEventOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 300,
            }}
          >
            <h3>Create Event</h3>
            <input
              placeholder="Event Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <input
              placeholder="Event Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <div className="mm-popup__box__footer__right-space">
              <button
                className="mm-popup__btn mm-popup__btn--save"
                onClick={() => {
                  if (!newTitle) return alert("Event Title required");
                  setEvents([
                    ...events,
                    {
                      id: new Date().getTime(),
                      title: newTitle,
                      location: newLocation,
                      start: newEventDate,
                      end: newEventDate,
                      isPast: newEventDate < new Date(),
                    },
                  ]);
                  setCreateEventOpen(false);
                }}
              >
                Save
              </button>
              <button
                className="mm-popup__btn mm-popup__btn--cancel"
                onClick={() => setCreateEventOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Delete Modal */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 8,
              width: 300,
            }}
          >
            <h3>Edit Event</h3>
            <input
              placeholder="Event Title"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              style={{ width: "100%", marginBottom: 10, padding: 5 }}
            />
            <div className="mm-popup__box__footer__right-space">
              <button
                className="mm-popup__btn mm-popup__btn--info mm-popup__btn--save"
                onClick={saveEvent}
              >
                Save
              </button>
              <button
                className="mm-popup__btn mm-popup__btn--danger"
                onClick={deleteEvent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
