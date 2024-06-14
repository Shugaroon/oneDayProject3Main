import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
  useLocation,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import MyCalendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";
import IconBar from "./components/IconBar";
import Header from "./components/Header";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";
import ProjectSelection from "./components/ProjectSelection";
import ProjectForm from "./components/ProjectForm";
import ThemeModal from "./components/ThemeModal";
import "./App.css";

const App = () => {
  const themes = {
    Default: "#003cff",
    Dark: "#333",
    Green: "#4CAF50",
  };

  const savedThemeColor = localStorage.getItem("themeColor") || themes.Default;

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [themeColor, setThemeColor] = useState(savedThemeColor);
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [themeModalAnchor, setThemeModalAnchor] = useState(null);

  const updateElementStyles = useCallback(() => {
    const elements = document.querySelectorAll(
      ".add-event-button, .view-mode-buttons button, .more-profiles, .badge, .dropdown"
    );
    elements.forEach(element => {
      if (element.classList.contains("dropdown")) {
        element.style.borderBottomColor = themeColor;
      } else if (element.classList.contains("active")) {
        element.style.backgroundColor = themeColor;
        element.style.color = "white";
      } else if (element.classList.contains("view-mode-button")) {
        element.style.backgroundColor = "white";
        element.style.color = "black";
      } else {
        element.style.backgroundColor = themeColor;
      }
    });
  }, [themeColor]);

  useEffect(() => {
    document.body.style.backgroundColor = themeColor;
    updateElementStyles();
  }, [themeColor, updateElementStyles]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleNavigate = newDate => {
    setDate(newDate);
  };

  const handleViewChange = newView => {
    setView(newView);
    setTimeout(() => {
      updateElementStyles();
    }, 0);
  };

  const handleAddEvent = () => {
    setShowAddEventModal(true);
  };

  const handleSaveEvent = (event, projectId) => {
    setEvents([...events, { ...event, projectId }]);
    setShowAddEventModal(false);
  };

  const handleAddProject = () => {
    setShowAddProjectModal(true);
  };

  const handleSaveProject = project => {
    const newProject = { ...project, id: uuidv4(), events: [] };
    setProjects([...projects, newProject]);
    setShowAddProjectModal(false);
  };
  // const onImportantSet = () => {};

  const openThemeModal = themeIconRef => {
    setThemeModalAnchor(themeIconRef);
    setShowThemeModal(true);
  };

  const closeThemeModal = () => {
    setShowThemeModal(false);
  };

  const selectTheme = color => {
    setThemeColor(color);
    localStorage.setItem("themeColor", color); // 로컬 스토리지에 저장
    closeThemeModal();
  };

  return (
    <Router>
      <AppContent
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        themeColor={themeColor}
        date={date}
        view={view}
        handleNavigate={handleNavigate}
        handleViewChange={handleViewChange}
        handleAddEvent={handleAddEvent}
        events={events}
        projects={projects}
        handleAddProject={handleAddProject}
        showAddEventModal={showAddEventModal}
        setShowAddEventModal={setShowAddEventModal}
        showAddProjectModal={showAddProjectModal}
        setShowAddProjectModal={setShowAddProjectModal}
        showThemeModal={showThemeModal}
        openThemeModal={openThemeModal}
        closeThemeModal={closeThemeModal}
        selectTheme={selectTheme}
        handleSaveEvent={handleSaveEvent}
        handleSaveProject={handleSaveProject}
        isMultiDay={isMultiDay}
        setIsMultiDay={setIsMultiDay}
        themeModalAnchor={themeModalAnchor}
      />
    </Router>
  );
};

const AppContent = ({
  sidebarOpen,
  toggleSidebar,
  themeColor,
  date,
  view,
  handleNavigate,
  handleViewChange,
  handleAddEvent,
  events,
  projects,
  handleAddProject,
  showAddEventModal,
  setShowAddEventModal,
  showAddProjectModal,
  setShowAddProjectModal,
  showThemeModal,
  openThemeModal,
  closeThemeModal,
  selectTheme,
  handleSaveEvent,
  handleSaveProject,
  isMultiDay,
  setIsMultiDay,
  themeModalAnchor,
}) => {
  const location = useLocation();

  useEffect(() => {
    const updateElementStyles = () => {
      const elements = document.querySelectorAll(
        ".add-event-button, .view-mode-buttons button, .more-profiles, .badge, .dropdown"
      );
      elements.forEach(element => {
        if (element.classList.contains("dropdown")) {
          element.style.borderBottomColor = themeColor;
        } else if (element.classList.contains("active")) {
          element.style.backgroundColor = themeColor;
          element.style.color = "white";
        } else if (element.classList.contains("view-mode-button")) {
          element.style.backgroundColor = "white";
          element.style.color = "black";
        } else {
          element.style.backgroundColor = themeColor;
        }
      });
    };

    updateElementStyles();
  }, [themeColor, location]);

  return (
    <div className="App" style={{ backgroundColor: themeColor }}>
      <div className={`container ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="inner-container">
          <Header />
          <div className="main-content">
            <div
              className={`sidebar-container ${sidebarOpen ? "open" : "hidden"}`}
            >
              <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            <div
              className={`icon-bar-container ${
                sidebarOpen ? "hidden" : "open"
              }`}
            >
              <IconBar
                toggleSidebar={toggleSidebar}
                openThemeModal={openThemeModal}
              />
            </div>
            <Routes>
              <Route
                path="/calendar/:projectId"
                element={
                  <ProjectCalendarWrapper
                    date={date}
                    view={view}
                    onNavigate={handleNavigate}
                    onView={handleViewChange}
                    onAddEvent={handleAddEvent}
                    events={events}
                    handleSaveEvent={handleSaveEvent}
                    showAddEventModal={showAddEventModal}
                    setShowAddEventModal={setShowAddEventModal}
                    isMultiDay={isMultiDay}
                    setIsMultiDay={setIsMultiDay}
                    themeColor={themeColor}
                  />
                }
              />
              <Route
                path="/calendar"
                element={
                  <div
                    className={`content-wrapper calendar-content-wrapper ${
                      sidebarOpen ? "sidebar-open" : ""
                    }`}
                  >
                    <MyCalendar
                      date={date}
                      view={view}
                      onNavigate={handleNavigate}
                      onView={handleViewChange}
                      onAddEvent={handleAddEvent}
                      events={events}
                    />
                  </div>
                }
              />
              <Route
                path="/"
                element={
                  <div
                    className={`content-wrapper project-content-wrapper ${
                      sidebarOpen ? "sidebar-open" : ""
                    }`}
                  >
                    <ProjectSelection
                      projects={projects}
                      onAddProject={handleAddProject}
                    />
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
        {showAddProjectModal && (
          <Modal
            isOpen={showAddProjectModal}
            onClose={() => setShowAddProjectModal(false)}
          >
            <ProjectForm
              onSave={handleSaveProject}
              onCancel={() => setShowAddProjectModal(false)}
            />
          </Modal>
        )}
      </div>
      {showAddProjectModal && (
        <Modal
          isOpen={showAddProjectModal}
          onClose={() => setShowAddProjectModal(false)}
        >
          <ProjectForm
            onSave={handleSaveProject}
            onCancel={() => setShowAddProjectModal(false)}
          />
        </Modal>
      )}
      {showThemeModal && (
        <ThemeModal
          isOpen={showThemeModal}
          onClose={closeThemeModal}
          selectTheme={selectTheme}
          anchorRef={themeModalAnchor}
        />
      )}
    </div>
  );
};

const ProjectCalendarWrapper = props => {
  const { projectId } = useParams();
  return (
    <div className="content-wrapper calendar-content-wrapper">
      <MyCalendar {...props} projectId={projectId} />
      <AddEventModal {...props} projectId={projectId} />
    </div>
  );
};

const AddEventModal = ({
  showAddEventModal,
  setShowAddEventModal,
  isMultiDay,
  setIsMultiDay,
  handleSaveEvent,
  projectId,
}) => {
  return (
    showAddEventModal && (
      <Modal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
      >
        <div className="event-type-selector">
          <button
            className="important-btn"
            type="button"
            // onClick={onImportantSet}a
          >
            🚨
          </button>
          <div className="event-type-btn-wrapper">
            <button
              className={!isMultiDay ? "active" : ""}
              onClick={() => setIsMultiDay(false)}
            >
              Single Day
            </button>
            <button
              className={isMultiDay ? "active" : ""}
              onClick={() => setIsMultiDay(true)}
            >
              Multi Day
            </button>
          </div>
        </div>
        <EventForm
          isMultiDay={isMultiDay}
          onSave={event => handleSaveEvent(event, projectId)}
          onCancel={() => setShowAddEventModal(false)}
          // onImportantSet={onImportantSet}
        />
      </Modal>
    )
  );
};

export default App;
