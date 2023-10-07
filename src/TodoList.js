import React, { useLayoutEffect, useState, useRef } from 'react';
import dragula from 'react-dragula';

const TodoList = () => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('todoItems');
    return savedItems ? JSON.parse(savedItems) : [
      { id: 1, text: 'Task 1', checked: false },
      { id: 2, text: 'Task 2', checked: false },
      { id: 3, text: 'Task 3', checked: false }
    ];
  });

  useLayoutEffect(()=> {
    if (editInputRef.current !== null) editInputRef.current.focus();
  })

  const [newTask, setNewTask] = useState('');
  const [editedTask, setEditedTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState('');
  const editInputRef = useRef(null);

  const dragulaDecorator = (componentBackingInstance) => {
    if (componentBackingInstance) {
      let options = {};
      const drake = dragula([componentBackingInstance], options);
      drake.on('drop', (el, target, source, sibling) => {
        // Handle drop here
      });
    }
  };

  const saveItemsToLocalStorage = (items) => {
    localStorage.setItem('todoItems', JSON.stringify(items));
  };

  const generateUniqueId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const updatedItems = [...items, { id: generateUniqueId(), text: newTask, checked: false }];
      setItems(updatedItems);
      saveItemsToLocalStorage(updatedItems);
      setNewTask('');
    }
  };

  const handleEditTask = (id) => {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      setUpdatedTask(items[index].text);
      setEditedTask(index);
    }
  };

  const handleUpdateTask = (id) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, text: updatedTask };
      }
      return item;
    });
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
    setEditedTask(null);
    setUpdatedTask('');
  };

  const handleDeleteTask = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
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

  const handleToggleCheckbox = (id) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked};
      }
      return item;
    });
    setItems(updatedItems);
    saveItemsToLocalStorage(updatedItems);
  };

  return (
    <div className="wrapper p-4">
      <div className="task-input flex">
        <input
          type="text"
          placeholder='입력 후 엔터'
          value={newTask}
          onChange={handleNewTaskChange}
          onKeyDown={(e) => addItemEnter(e.key)}
          className="flex-grow p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleAddTask}
          className="ml-2 w-12 h-12 bg-green-500 text-black p-2 rounded"
        >
          <img src="plus-square-line-icon.svg" alt="plus" className="ml-1 w-6 h-6" />
        </button>
      </div>
      <div className="task-list mt-4" ref={dragulaDecorator}>
        {items.map((task, index) => (
          <div key={task.id} className="task items-center justify-between mb-2 p-2 border rounded">
            {editedTask === index ? (
              <div className="flex items-center">
                <input
                  ref={editInputRef}
                  type="text"
                  name="content"
                  value={updatedTask}
                  onChange={(e) => setUpdatedTask(e.target.value)}
                  onKeyDown={(e) => updateItemEnter(e.key, task.id)}
                  className="flex-grow p-2 bg-black rounded"
                />
                <button onClick={() => handleUpdateTask(task.id)} className="ml-2 bg-blue-500 text-white p-2 rounded">
                  <img src="check-mark-box-icon.svg" alt="Done" className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex">
                <input
                  type="checkbox"
                  checked={task.checked}
                  onChange={() => handleToggleCheckbox(task.id)}
                  className="mr-2 w-8"
                />
                <div name="content" className={ 'w-full '+(task.checked ? 'line-through' : '')}>
                  {task.text}
                </div>
                <button
                  className="ml-2 w-8 bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleEditTask(task.id)}
                >
                  <img src="edit-box-icon.svg" alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  className="ml-2 w-8 bg-red-500 text-white p-2 rounded"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <img src="trash-can-icon.svg" alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default TodoList;