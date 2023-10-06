import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import dragula from 'dragula';

const TodoList = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('todoItems');
    return savedItems ? JSON.parse(savedItems) : [
      { text: 'Task 1', checked: false },
      { text: 'Task 2', checked: false },
      { text: 'Task 3', checked: false }
    ];
  });

  const [newTask, setNewTask] = useState('');
  const [editedTask, setEditedTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState('');
  const editInputRef = useRef(null);  // Reference for the edit input

  const [isEditing, setIsEditing] = useState(false); // Flag to track if in edit mode

  useEffect(() => {
    const containers = document.querySelectorAll('.task');
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
      const updatedItems = [...items, { text: newTask, checked: false }];
      setItems(updatedItems);
      saveItemsToLocalStorage(updatedItems);
      setNewTask('');
    }
  };  

  const handleEditTask = (index) => {
    setUpdatedTask(items[index].text);  // Store the task text for editing
    setEditedTask(index);
    setIsEditing(true); // Enable edit mode
  };  

  const handleUpdateTask = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      text: updatedTask  // Update the task text
    };
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

  const handleToggleCheckbox = (index) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      checked: !updatedItems[index].checked
    };
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
  };

  return (
    <div className="wrapper">
      <div className="task-input">
        <input
          type="text"
          placeholder='입력 후 엔터'
          value={newTask}
          onChange={handleNewTaskChange}
          onKeyDown={(e) => addItemEnter(e.key)}
        />
        {/* <button onClick={handleAddTask}><img src="plus-square-icon.svg" alt="plus"/></button> */}
      </div>
      {items.map((task, index) => (
        <div key={index} className="task">
          {editedTask === index ? (
            <div>
              <input
                ref={editInputRef}
                type="text"
                value={updatedTask}
                onChange={(e) => setUpdatedTask(e.target.value)}
                onKeyDown={(e) => updateItemEnter(e.key, index)}
              />
              <button onClick={() => handleUpdateTask(index)}><img src="check-mark-box-icon.svg" alt="Done"/></button>
            </div>
          ) : (
            <div>
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => handleToggleCheckbox(index)}
              />
              <span style={{ textDecoration: task.checked ? 'line-through' : 'none' }}>
                {task.text}
              </span>
              <button onClick={() => handleDeleteTask(index)}><img src="trash-can-icon.svg" alt="Delete"/></button>
              <button onClick={() => handleEditTask(index)}><img src="edit-box-icon.svg" alt="Edit"/></button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodoList;