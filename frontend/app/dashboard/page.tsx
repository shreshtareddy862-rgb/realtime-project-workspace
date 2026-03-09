"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import API from "../../services/api";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  description: string;
};

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskCounts, setTaskCounts] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    router.push("/login");
    return;
  }

  fetchProjects();
}, []);
  const fetchProjects = async () => {
    const res = await API.get("/projects", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
    setProjects(res.data);

    const counts: any = {};
    for (const project of res.data) {
       const tasks = await API.get(`/tasks/${project.id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
      counts[project.id] = tasks.data.length;
    }
    setTaskCounts(counts);
  };

  const createProject = async () => {
    await API.post("/projects", {
      title,
      description,
    });

    setTitle("");
    setDescription("");

    fetchProjects();
  };

  const editProject = async (project:any) => {

    const newTitle = prompt("Edit project title", project.title);
    const newDescription = prompt("Edit project description", project.description);

    if (!newTitle) return;

    await API.put(`/projects/${project.id}`, {
      title: newTitle,
      description: newDescription
    });

    fetchProjects();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Projects Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Create Project Section */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4">

        <input
          placeholder="Project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-1/3 text-gray-900 placeholder-gray-500 bg-white"
        />

        <input
          placeholder="Project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded w-1/3 text-gray-900 placeholder-gray-500 bg-white"
        />

        <button
          onClick={createProject}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Project
        </button>

      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-3 gap-6">

        {projects.length === 0 && (
          <p className="text-gray-500">
            No projects yet. Create your first project.
          </p>
        )}

        {projects.map((project) => (
          <div key={project.id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

            <Link href={`/board/${project.id}`}>

              <h3 className="text-xl font-semibold text-gray-800">
                {project.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {project.description}
              </p>

              <p className="text-sm text-gray-500 mt-2">
                {taskCounts[project.id] || 0} Tasks
              </p>

              <p className="mt-4 text-blue-600 font-semibold">
                Open Board →
              </p>

            </Link>

            <div className="flex gap-4 mt-3">

              <button
                onClick={() => editProject(project)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={async () => {
                  if (!confirm("Delete this project?")) return;
                  await API.delete(`/projects/${project.id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});
                  fetchProjects();
                }}
                className="text-red-500 text-sm"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}