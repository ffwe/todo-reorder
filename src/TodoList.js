import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import dragula from 'dragula';

const TodoList = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('todoItems');
    return savedItems ? JSON.parse(savedItems) : ['Task 1', 'Task 2', 'Task 3'];
  });
  const [newTask, setNewTask] = useState('');
  const [editedTask, setEditedTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState('');
  const editInputRef = useRef(null);  // Reference for the edit input

  const [isEditing, setIsEditing] = useState(false); // Flag to track if in edit mode

  useEffect(() => {
    const containers = document.querySelectorAll('.task-list');
    const drake = dragula(Array.from(containers), {
      moves: (el, source, handle, sibling) => {
        // Disable drag during editing
        return !isEditing;
      }
    });

    drake.on('drop', (el, target, source, sibling) => {
      // ... (rest of the code for handling drop)
    });

    return () => {
      drake.destroy(); // Cleanup the dragula instance
    };
  }, [items, isEditing]);

  useLayoutEffect(()=> {
    if (editInputRef.current !== null) editInputRef.current.focus();
  })

  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem('todoItems', JSON.stringify(items));
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const updatedItems = [...items, newTask];
      setItems(updatedItems);
      saveItemsToLocalStorage(updatedItems);
      setNewTask('');
    }
  };

  const handleEditTask = (index) => {
    setUpdatedTask(items[index]);
    setEditedTask(index);
    setIsEditing(true); // Enable edit mode
  };

  const handleUpdateTask = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = updatedTask;
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
    setEditedTask(null);
    setIsEditing(false); // Disable edit mode
  };

  const handleDeleteTask = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
  };
  const addItemEnter = key =>{
    if(key === 'Enter') {
	  	handleAddTask();
	  }
  }
  const updateItemEnter = (key, index) =>{
    if(key === 'Enter') {
	  	handleUpdateTask(index);
	  }
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={handleNewTaskChange}
          onKeyDown={(e) => addItemEnter(e.key)}
        />
        <button onClick={handleAddTask}>Add New Task</button>
      </div>
      {items.map((task, index) => (
        <div key={index} className="task-list">
          {editedTask === index ? (
            <div>
              <input
                ref={editInputRef}
                type="text"
                value={updatedTask}
                onChange={(e) => setUpdatedTask(e.target.value)}
                onKeyDown={(e) => updateItemEnter(e.key, index)}
              />
              <button onClick={() => handleUpdateTask(index)}>Done</button>
            </div>
          ) : (
            <div>
              {task}
              <button onClick={() => handleEditTask(index)}>Edit</button>
              <button onClick={() => handleDeleteTask(index)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
