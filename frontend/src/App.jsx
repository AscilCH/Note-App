import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import horseImage from './horse.png';

import { Container, Row, Col, Form, Button, Card, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

function App() {
  const [backendData,setBackendData]=useState();
  useEffect(() => {
    fetch("/api")
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setBackendData(data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
      });
  }, []);
  const [currentId, setCurrentId] = useState(0);
  const [note, setNote] = useState({ id: currentId, body: "", check: false, renaming: true });
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradientColor, setGradientColor] = useState('linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)');

  useEffect(() => {
    const handleKeyDown = () => {
      const colors = ['#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb', '#9795f0', '#fbc7d4'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newGradientColor = `linear-gradient(135deg, ${randomColor} 0%, ${randomColor} 100%)`;
      setGradientColor(newGradientColor);

      // Move the horse from right to left
      const horse = document.querySelector('.horse');
      horse.classList.add('move');

      // Remove the move class after the animation ends
      setTimeout(() => {
        horse.classList.remove('move');
      }, 5000); // Adjust this timeout to match the duration of the animation
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function addTask() {
    const newNote = { id: currentId, body: note.body, check: false, renaming: false };
    setTasks(prevTasks => [newNote, ...prevTasks]);
    setCurrentId(prevId => prevId + 1);
    setNote({ id: currentId + 1, body: "", check: false, renaming: false });
  }

  const toggleCheck = taskId => {
    setTasks(prevTasks =>
      prevTasks.map(prevTask =>
        prevTask.id === taskId ? { ...prevTask, check: !prevTask.check } : prevTask
      )
    );
  };

  const toggleRename = taskId => {
    setTasks(prevTasks =>
      prevTasks.map(prevTask =>
        prevTask.id === taskId ? { ...prevTask, renaming: !prevTask.renaming } : prevTask
      )
    );
  };

  const updateTaskBody = (taskId, body) => {
    setTasks(prevTasks =>
      prevTasks.map(prevTask =>
        prevTask.id === taskId ? { ...prevTask, body: body } : prevTask
      )
    );
  };

  const deleteTask = taskId => {
    setTasks(prevTasks =>
      prevTasks.filter(prevTask => prevTask.id !== taskId)
    );
  };

  const filteredTasks = tasks.filter(task => task.body.toLowerCase().includes(searchTerm.toLowerCase()));

  const taskList = filteredTasks.map(task => (
    <Card className="mb-3" key={task.id}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <InputGroup className="align-items-center">
          <InputGroup.Checkbox
            aria-label="Checkbox for following text input"
            checked={task.check}
            onChange={() => toggleCheck(task.id)}
          />
          {task.renaming ? (
            <Form.Control
              type="text"
              value={task.body}
              onChange={e => updateTaskBody(task.id, e.target.value)}
              placeholder="Change Me"
              className="ms-2"
            />
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-${task.id}`}>{task.body}</Tooltip>}
            >
              <Card.Text className={`ms-2 mb-0 text-truncate ${task.check ? 'text-decoration-line-through' : ''}`}>
                {task.body}
              </Card.Text>
            </OverlayTrigger>
          )}
        </InputGroup>
        <div className="task-buttons">
          <Button variant="primary" className="me-2" onClick={() => toggleRename(task.id)}>
            {task.renaming ? 'Confirm' : 'Rename'}
          </Button>
          <Button variant="danger" onClick={() => deleteTask(task.id)}>Delete</Button>
        </div>
      </Card.Body>
    </Card>
  ));

  return (

  
    <div className="app-container" style={{ background: gradientColor }}>
      {console.log(backendData)}
          {typeof backendData === 'undefined' ? (
      <p>Welcome, Ascil</p>
    ) : (
      backendData.users.map((user, i) => (
        <p key={i}>{user}</p>
      ))
    )}
      <Container className={`my-5 p-4 border rounded note-app-container`}>
        <Row className="mb-4">
          <Col>
            {/* Add the horse image */}
            <img src={horseImage} alt="Horse" className="horse" style={{ maxHeight: '200px' }} />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">To-Do App</h1>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <InputGroup>
              <Form.Control
                type="text"
                value={note.body}
                onChange={e => setNote(prevNote => ({ ...prevNote, body: e.target.value, id: currentId }))}
                placeholder="Add your task here"
              />
              <Button variant="success" onClick={addTask}>Add Task</Button>
            </InputGroup>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Control
              type="text"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {taskList.length > 0 ? taskList : <p className="text-center">No tasks found</p>}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
