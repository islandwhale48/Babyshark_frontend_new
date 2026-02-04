import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from "react";
import MainLayout from "../../Layout/MainLayout";
export default function Licenses() {
  const { startupId } = useParams();

  const [licenses, setLicenses] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const licensesRes = await axios.get(
        `http://localhost:5000/api/compliance/licenses/${startupId}`
      );

      const dashboardRes = await axios.get(
        `http://localhost:5000/api/compliance/dashboard/${startupId}`
      );

      const map = {};
      dashboardRes.data.forEach(item => {
        map[item.licenseId._id] = item.status;
      });

      setLicenses(licensesRes.data);
      setStatuses(map);
    };

    fetchData();
  }, [startupId]);

  const updateStatus = async (licenseId, status) => {
    const res = await axios.patch(
      `http://localhost:5000/api/compliance/status/${startupId}/${licenseId}`,
      { status }
    );

    setStatuses(prev => ({ ...prev, [licenseId]: status }));
    setProgress(res.data.progress);
    setUnlocked(res.data.collaborationUnlocked);
  };

 return (
  <div><MainLayout/>
  <div className="max-w-6xl mx-auto px-6 py-10 text-black-100">
    {/* Header */}
    <h1 className="text-3xl font-bold mb-1 text-black">
      Licenses & Compliance
    </h1>
    <p className="text-shadow-black-400 mb-8">
      Track your legal readiness step by step
    </p>

    {/* Progress */}
    <div className="mb-12">
      <div className="flex justify-between text-sm mb-2 text-black-300">
        <span>Compliance Progress</span>
        <span className="font-semibold">{progress}%</span>
      </div>

      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>

    {/* License cards */}
    <div className="grid md:grid-cols-2 gap-6">
      {licenses.map(license => (
        <div
          key={license._id}
          className="bg-gradient-to-br from-zinc-900 to-zinc-800 
                     border border-zinc-700 rounded-2xl p-6
                     hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10
                     transition-all"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            {license.name}
          </h3>

          <label className="block text-xs uppercase tracking-wide text-zinc-400 mb-1">
            Status
          </label>

          <select
            value={statuses[license._id] || "Not Started"}
            onChange={e =>
              updateStatus(license._id, e.target.value)
            }
            className="w-full bg-zinc-900 text-white
                       border border-zinc-600 rounded-lg
                       px-3 py-2 mb-4
                       focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Applied</option>
            <option>Approved</option>
            <option>Needs Action</option>
          </select>

          <a
            href={license.officialLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2
                       text-sm font-medium text-violet-400
                       hover:text-violet-300 transition"
          >
            Apply on official portal
            <span>→</span>
          </a>
        </div>
      ))}
    </div>

    {/* Unlock section */}
    {unlocked && (
      <div className="mt-14 bg-gradient-to-br from-zinc-900 to-zinc-800 
                      border border-violet-500/30 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-2">
          🎉 Collaboration Unlocked
        </h2>
        <p className="text-zinc-400 mb-6">
          Your compliance unlocks new opportunities
        </p>

        <div className="grid md:grid-cols-4 gap-4">
          {["Co-founders", "Talent", "Sponsors", "Mentors"].map(x => (
            <div
              key={x}
              className="border border-zinc-700 rounded-xl p-4
                         text-center text-white
                         hover:bg-zinc-800 hover:border-violet-400
                         transition"
            >
              {x}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
