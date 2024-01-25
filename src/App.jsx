import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentId, setCurrentId] = useState(0);
  const [note, setNote] = useState({ id: currentId, body: "", check: false, renaming: true });
  const [tasks, setTasks] = useState([]);

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

  const taskList = tasks.map(task => (
    <div className="container2-task" key={task.id}>
      <input
        type="checkbox"
        onClick={() => toggleCheck(task.id)}
      />
      {task.renaming ? (
        <input
          type="text"
          onChange={e => updateTaskBody(task.id, e.target.value)}
          value={task.body}
          placeholder="Change Me"
        />
      ) : (
        <div className="container2-task-title">{task.body}</div>
      )}
      <div className="container2-task-buttons">
        <button onClick={() => toggleRename(task.id)}>
          {task.renaming ? <>Confirm</> : <>Rename</>}
        </button>
        <button onClick={() => deleteTask(task.id)}>
          Delete
        </button>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="container-text">To Do App</div>
      <div className="container-add">
        <input
          type="text"
          onChange={e => setNote(prevNote => ({ ...prevNote, body: e.target.value, id: currentId }))}
          value={note.body}
          placeholder="Add your task here"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <span className="container-line"></span>
      <div className="container2">{taskList}</div>
    </div>
  );
}

export default App;
