import { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  SlidersHorizontal,
  X,
} from "lucide-react";

function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);


  const internships = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "STC",
      location: "Riyadh",
      type: "Full-time",
      tags: ["React", "JavaScript", "UI"],
      description: "Work on modern web apps using React.",
      duration: "3 months",
      salary: "3000 SAR",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "UI/UX Designer Intern",
      company: "Aramco",
      location: "Dhahran",
      type: "Part-time",
      tags: ["Figma", "UX", "Design"],
      description: "Design user experiences for real products.",
      duration: "6 months",
      salary: null,
      posted: "5 days ago",
    },
  ];

  const filteredInternships = useMemo(() => {
    return internships.filter((i) => {
      const matchesSearch =
        searchQuery === "" ||
        i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === "all" || i.type === selectedType;
      const matchesLocation =
        selectedLocation === "all" || i.location === selectedLocation;

      return matchesSearch && matchesType && matchesLocation;
    });
  }, [searchQuery, selectedType, selectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/*  Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 py-16 text-center text-white">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Dream Internship
        </h1>
        <p className="text-purple-200 mb-8">
          Explore opportunities across Saudi Arabia
        </p>

        {/*  Search */}
        <div className="max-w-2xl mx-auto bg-white p-2 rounded-xl flex gap-2">
          <input
            type="text"
            placeholder="Search internships..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 outline-none text-black"
          />

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 bg-gray-100 rounded-lg"
          >
            <SlidersHorizontal />
          </button>

          <button className="px-6 bg-purple-600 text-white rounded-lg">
            Search
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white text-black mt-4 p-4 rounded-xl max-w-2xl mx-auto">
            <div className="flex justify-between mb-3">
              <h3 className="font-bold">Filters</h3>
              <X
                className="cursor-pointer"
                onClick={() => setShowFilters(false)}
              />
            </div>

            <div className="flex gap-4">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Locations</option>
                <option value="Riyadh">Riyadh</option>
                <option value="Dhahran">Dhahran</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/*  Cards */}
      <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInternships.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold mb-2">{item.title}</h2>
            <p className="text-gray-600">{item.company}</p>

            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <MapPin className="w-4 h-4 text-purple-500" />
              {item.location}
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {item.description}
            </p>

            <div className="flex justify-between text-sm mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {item.duration}
              </span>

              {item.salary && (
                <span className="flex items-center gap-1 text-green-600">
                  <DollarSign className="w-4 h-4" />
                  {item.salary}
                </span>
              )}
            </div>

            <button className="w-full bg-purple-600 text-white py-2 rounded-lg">
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Browse;