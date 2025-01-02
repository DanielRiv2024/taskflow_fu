'use client';

import { useState, useEffect } from 'react';
import { Plus, Bell } from 'lucide-react';

const categories = ['Personal', 'Trabajo', 'Compras', 'Otros'];

function Header() {
  return (
    <div className="flex justify-between items-center p-4 mb-8 bg-black border rounded-md text-white">
      <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="text-white" size={24} />
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 text-center">
            3
          </span>
        </div>
        <span>Usuariocorreo@unidad.prueba</span>
      </div>
    </div>
  );
}

function TaskStatistics({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = tasks.filter(task => task.category === category).length;
    return acc;
  }, {});

  const categoryProgress = categories.map(category => ({
    category,
    percentage: (categoryCounts[category] / totalTasks) * 100 || 0,
  }));

  return (
    <div className="w-1/3 p-4 bg-gray-100 rounded">
      <div className="text-lg font-semibold mb-2">Estadísticas:</div>
      <div>Total de tareas: {totalTasks}</div>
      <div>Tareas completadas: {completedTasks}</div>
      <div>Tareas en proceso: {activeTasks}</div>
      <div className="mt-2">
        <div className="font-semibold">Avance por categoría:</div>
        {categoryProgress.map(({ category, percentage }) => (
          <div key={category} className="mb-2">
            <span>{category}: {percentage.toFixed(1)}%</span>
            <div className="h-2 bg-gray-300 rounded-full mt-1">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskFilters({ filter, setFilter, searchQuery, setSearchQuery }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded bg-gray-100 text-black"
      >
        <option value="all">Todas</option>
        <option value="active">Activas</option>
        <option value="completed">Completadas</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Buscar tareas..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 rounded w-1/2 bg-gray-100 text-black"
      />
    </div>
  );
}

function TaskForm({ newTask, setNewTask, newCategory, setNewCategory, addTask }) {
  return (
    <form onSubmit={addTask} className="flex space-x-2 mb-4">
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="border p-2 rounded w-full bg-gray-100 text-black"
      />
      <select
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="border p-2 rounded bg-gray-100 text-black"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button type="submit" className="bg-black text-white px-4 py-2 rounded flex items-center">
        <Plus className="mr-2" /> Agregar
      </button>
    </form>
  );
}

function TaskList({toggleTask, deleteTask, filteredTasks }) {
  return (
    <ul>
      {filteredTasks.map(task => (
        <li key={task.id} className="flex justify-between items-center border-b py-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="mr-2"
            />
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.text}
            </span>
            <span className="ml-2 text-sm text-gray-500">({task.category})</span>
          </div>
          <button
            onClick={() => deleteTask(task.id)}
            className=" bg-red-500 text-white px-4 py-2 rounded flex items-center"
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false, category: newCategory }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'completed' && task.completed) || task.category === filter;
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white text-black">
      <Header />
      <div className="flex space-x-4">
        <TaskStatistics tasks={tasks} />
        <div className="flex-1">
          <TaskForm
            newTask={newTask}
            setNewTask={setNewTask}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            addTask={addTask}
          />
          <TaskFilters
            filter={filter}
            setFilter={setFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <TaskList tasks={tasks} toggleTask={toggleTask} deleteTask={deleteTask} filteredTasks={filteredTasks} />
        </div>
      </div>
    </div>
  );
}