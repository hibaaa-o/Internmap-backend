import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";


delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const jobs = [
  {
    title: "Software Engineering Intern",
    company: "Saudi Aramco",
    location: [26.2361, 50.0393], // Dhahran
  },
  {
    title: "Data Science Intern",
    company: "STC",
    location: [24.7136, 46.6753], // Riyadh
  },
  {
    title: "UX/UI Intern",
    company: "Noon",
    location: [24.7136, 46.6753],
  },
];

export default function MapView() {
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen">

      {/* LEFT PANEL */}
      <div className="w-[400px] bg-white shadow-xl flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-900 text-white p-6">

          <h1 className="text-xl font-bold">Map View</h1>
          <p className="text-sm text-purple-200 mb-4">
            {jobs.length} opportunities
          </p>

          <input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 px-4 rounded-xl bg-white/10 placeholder-white/70 outline-none"
          />
        </div>

        {/* Jobs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {jobs.map((job, index) => (
            <div
              key={index}
              className="border rounded-2xl p-4 hover:shadow-md transition"
            >
              <h2 className="font-semibold text-lg">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>

              <div className="text-sm text-gray-500 mt-2">
                Saudi Arabia
              </div>

              <div className="mt-3 flex gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  React
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Python
                </span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* MAP */}
      <div className="flex-1">

        <MapContainer
          center={[24.7136, 46.6753]}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {jobs.map((job, index) => (
            <Marker key={index} position={job.location as [number, number]}>
              <Popup>
                <strong>{job.title}</strong>
                <br />
                {job.company}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

      </div>
    </div>
  );
}