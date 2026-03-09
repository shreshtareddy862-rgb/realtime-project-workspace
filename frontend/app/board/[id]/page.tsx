"use client";
import API from "../../../services/api";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

type Task = {
  attachment: any;
  assignee: string;
  priority: string;
  id: number;
  title: string;
  description: string;
  status: string;
};

export default function Board() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  const params = useParams();
  const projectId = params.id as string;

  useEffect(() => {

    const socket = io("http://localhost:5001");

    socket.on("taskUpdated", () => {
      fetchTasks();
      fetchActivities();
    });

    fetchTasks();
    fetchActivities();
    fetchProject();

    return () => {
      socket.disconnect();
    };

  }, []);

  const fetchTasks = async () => {
    const res = await API.get(`/tasks/${projectId}`);
    setTasks(res.data);
  };

  const fetchActivities = async () => {
    const res = await API.get(`/activities/${projectId}`);
    setActivities(res.data);
  };

  const fetchProject = async () => {
    const res = await API.get(`/projects`);
    const found = res.data.find((p: any) => p.id == projectId);
    setProject(found);
  };

  const createTask = async () => {
    await API.post("/tasks", {
      title,
      description,
      priority,
      assignee,
      project_id: projectId
    });

    setTitle("");
    setDescription("");

    fetchTasks();
  };

  const updateStatus = async (taskId: number, status: string) => {
    await API.put(`/tasks/status/${taskId}`, { status });
    fetchTasks();
    fetchActivities();
  };

  const deleteTask = async (taskId: number) => {
    await API.delete(`/tasks/${taskId}`);
    fetchTasks();
    fetchActivities();
  };

  const editTask = async (task: any) => {

    const newTitle = prompt("Edit title", task.title);
    const newDescription = prompt("Edit description", task.description);

    if (!newTitle || !newDescription) return;

    await API.put(`/tasks/edit/${task.id}`, {
      title: newTitle,
      description: newDescription,
      priority: task.priority,
      assignee: task.assignee
    });

    fetchTasks();
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const taskId = parseInt(result.draggableId);
    const newStatus = result.destination.droppableId;

    updateStatus(taskId, newStatus);
  };

  const renderColumn = (status: string, columnTitle: string) => {

    const filtered = tasks.filter((t) => {

      if (t.status !== status) return false;

      if (priorityFilter && t.priority !== priorityFilter) return false;

      if (
        assigneeFilter &&
        !t.assignee.toLowerCase().includes(assigneeFilter.toLowerCase())
      ) return false;

      return true;
    });

    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="bg-gray-50 rounded-xl p-4 min-h-[450px] shadow-md"
          >

            <h2 className="font-semibold text-lg mb-3 text-gray-800">
              {columnTitle}
            </h2>

            {filtered.length === 0 && (
              <p className="text-gray-400 text-sm">No tasks</p>
            )}

            {filtered.map((task, index) => (

              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >

                {(provided) => (

                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-white rounded-lg shadow-md p-4 mt-3 hover:shadow-xl transition"
                    style={provided.draggableProps.style}
                  >

                    <h4 className="font-bold text-gray-900 text-lg">
                      {task.title}
                    </h4>

                    <p className="text-gray-700 text-sm mt-1">
                      {task.description}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      Priority: {task.priority}
                    </p>

                    <p className="text-xs text-gray-500">
                      Assignee: {task.assignee}
                    </p>

                    <input
                      type="file"
                      onChange={async (e) => {

                        const file = e.target.files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append("file", file);

                        await API.post(`/tasks/upload/${task.id}`, formData, {
                          headers: {
                            "Content-Type": "multipart/form-data"
                          }
                        });

                          alert("File uploaded");
                      }}
                      className="mt-2 text-xs"
                    />

                    {task.attachment && (
                      <a
                        href={`http://localhost:5001/${task.attachment}`}
                        target="_blank"
                        className="text-blue-500 text-xs block mt-1"
                      >
                        View Attachment
                      </a>
                    )}

                    <button
                      onClick={() => editTask(task)}
                      className="text-blue-500 text-sm mt-2 mr-3"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>

                  </div>
                )}

              </Draggable>
            ))}

            {provided.placeholder}

          </div>
        )}
      </Droppable>
    );
  };

  const validTasks = tasks.filter(
    t => t.status === "todo" || t.status === "in-progress" || t.status === "done"
  );

  const completed = validTasks.filter(t => t.status === "done").length;

  const progress = validTasks.length
    ? Math.round((completed / validTasks.length) * 100)
    : 0;

  const tasksPerMember: Record<string, number> = {};

  tasks.forEach((task) => {
    const member = task.assignee || "Unassigned";

    if (!tasksPerMember[member]) {
      tasksPerMember[member] = 0;
    }

    tasksPerMember[member]++;
  });

  return (

    <div className="p-8 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        {project ? project.title : "Project Board"}
      </h1>

      {/* Progress */}

      <div className="mb-6">

        <p className="text-gray-700 mb-2">
          Project Progress: <b>{progress}%</b>
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3">

          <div
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          />

        </div>

      </div>

      {/* Create Task */}

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">

        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded text-gray-900"
        />

        <input
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded text-gray-900"
        />

        <input
          placeholder="Assignee"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="border p-2 rounded text-gray-900"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded text-gray-900"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <button
          onClick={createTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>

      </div>

      {/* Filters */}

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border p-2 rounded text-gray-900"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded text-gray-900"
        >
          <option value="">All Status</option>
          <option value="todo">To-Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <input
          placeholder="Search assignee"
          value={assigneeFilter}
          onChange={(e) => setAssigneeFilter(e.target.value)}
          className="border p-2 rounded text-gray-900"
        />

      </div>

      {/* Board */}

      <DragDropContext onDragEnd={onDragEnd}>

        <div className="grid grid-cols-3 gap-6">
          {renderColumn("todo", "To-Do")}
          {renderColumn("in-progress", "In-Progress")}
          {renderColumn("done", "Done")}
        </div>

      </DragDropContext>

      {/* Task Distribution */}

      <div className="mt-10 bg-white p-4 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          Task Distribution
        </h2>

        {Object.keys(tasksPerMember).map((member) => (

          <div
            key={member}
            className="flex justify-between border-b py-2 text-sm"
          >

            <span className="text-gray-700">
              {member}
            </span>

            <span className="text-gray-500">
              {tasksPerMember[member]} tasks
            </span>

          </div>

        ))}

      </div>

      {/* Activity Timeline */}

      <div className="mt-10 bg-white p-4 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-3 text-gray-900">
          Activity Timeline
        </h2>

        {activities.map((a) => (
          <div key={a.id} className="border-b py-3 text-gray-700">
            {a.message}
          </div>
        ))}

      </div>

    </div>
  );
}