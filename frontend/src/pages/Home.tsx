import { MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 text-white text-center pt-28 pb-40 px-6 relative overflow-hidden">

        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Discover Your Future
          <br />
          <span className="text-purple-200">with InternMap</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-purple-200 max-w-2xl mx-auto leading-relaxed">
          Find internships across Saudi Arabia, connect with top companies,
          and start building your career today.
        </p>

      </div>

      {/* FEATURE SECTION */}
      <div className="px-8 py-20 max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-900 text-center mb-14">
          Why InternMap?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Card 1 */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">
              Smart Search
            </h3>
            <p className="text-gray-600">
              Easily find internships that match your skills and interests.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">
              Map Exploration
            </h3>
            <p className="text-gray-600">
              Explore opportunities visually across different cities.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Manage your applications and stay organized easily.
            </p>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="bg-gray-50 py-16">

        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-16 text-center">

          <div>
            <h2 className="text-4xl font-bold text-purple-600 mb-2">
              500+
            </h2>
            <p className="text-gray-600">
              Companies
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-purple-600 mb-2">
              1000+
            </h2>
            <p className="text-gray-600">
              Internships
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-purple-600 mb-2">
              95%
            </h2>
            <p className="text-gray-600">
              Success Rate
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center py-10 text-gray-500 text-sm">
        © 2026 InternMap — All rights reserved
      </div>

    </div>
  );
}