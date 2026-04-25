import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const cityCoords: Record<string, [number, number]> = {
  Riyadh: [24.7136, 46.6753],
  Dammam: [26.4207, 50.0888],
  Khobar: [26.2794, 50.2083],
  Jeddah: [21.5433, 39.1728],
};

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type Internship = {
  id: number;
  title: string;
  company: string;
  description?: string;
  location?: string;
};

type InternshipWithCoords = Internship & {
  lat: number;
  lng: number;
};

type GeoCache = Record<string, { lat: number; lng: number }>;

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);

  return null;
}

export default function MapView() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [mapped, setMapped] = useState<InternshipWithCoords[]>([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState("");

  const cities = useMemo(() => {
    const unique = Array.from(
      new Set(
        internships
          .map((i) => i.location?.trim())
          .filter(Boolean) as string[]
      )
    );
    return ["All", ...unique];
  }, [internships]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/internships");
        const data = await res.json();

        if (res.ok) {
          setInternships(data);
        } else {
          setError("Failed to load internships");
        }
      } catch (err) {
        console.error(err);
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const geocode = async () => {
      if (!internships.length) {
        setMapped([]);
        return;
      }

      setGeoLoading(true);

      try {
        const cache: GeoCache = {};

        const uniqueLocations = Array.from(
          new Set(
            internships
              .map((i) => i.location?.trim())
              .filter(Boolean) as string[]
          )
        );

        for (const city of uniqueLocations) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${city},Saudi&limit=1`
            );
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
              cache[city] = {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
              };
            }
          } catch (err) {
            console.error("Geocoding failed for", city, err);
          }
        }

        const ready = internships
          .map((i) => {
            const coords = cache[i.location || ""];
            if (!coords) return null;
            return {
              ...i,
              lat: coords.lat,
              lng: coords.lng,
            };
          })
          .filter(Boolean) as InternshipWithCoords[];

        setMapped(ready);
      } catch (err) {
        console.error(err);
        setError("Failed to load map coordinates");
      } finally {
        setGeoLoading(false);
      }
    };

    geocode();
  }, [internships]);

  const filtered =
    selectedCity === "All"
      ? mapped
      : mapped.filter((i) => i.location === selectedCity);

  const points = filtered.map((i) => [i.lat, i.lng]) as [number, number][];

  if (loading) {
    return <p className="p-8 text-center">Loading internships...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Internship Map
            </h1>
            <p className="text-gray-600 mt-1">
              Explore opportunities across Saudi Arabia
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-2 bg-white shadow-sm"
            >
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedCity("All")}
              className="px-4 py-2 border border-gray-200 rounded-2xl bg-white shadow-sm hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Selected City</p>
            <h2 className="text-xl font-semibold text-gray-900 mt-1">
              {selectedCity}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Visible Internships</p>
            <h2 className="text-xl font-semibold text-purple-600 mt-1">
              {filtered.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">Available Cities</p>
            <h2 className="text-xl font-semibold text-gray-900 mt-1">
              {cities.length - 1}
            </h2>
          </div>
        </div>
      </div>

      {geoLoading && (
        <div className="mb-4 bg-yellow-50 text-yellow-700 px-4 py-3 rounded-xl">
          Loading real coordinates for cities...
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No internships found
          </h2>
          <p className="text-gray-500 mb-4">
            There are no internships available for {selectedCity}.
          </p>
          <button
            onClick={() => setSelectedCity("All")}
            className="px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700"
          >
            Show All Cities
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-4">
          <MapContainer
            center={[24.7136, 46.6753]}
            zoom={6}
            style={{ height: "600px", width: "100%", borderRadius: "16px" }}
          >
            <FitBounds points={points} />

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

    {filtered.map((i) => {
  const coords = cityCoords[i.location as keyof typeof cityCoords];
  console.log("LOCATION:", i.location, "COORDS:", coords);

  if (!coords) return null;

  return (
    <Marker key={i.id} position={coords}>
      <Popup>
        <div className="min-w-[180px] space-y-2">
          <h2 className="font-bold text-base text-gray-900">{i.title}</h2>
          <p className="text-sm text-gray-700">Company: {i.company}</p>
          <p className="text-sm text-gray-700">City: {i.location}</p>
        </div>
      </Popup>
    </Marker>
  );
})}
          </MapContainer>
        </div>
      )}
    </div>
  );
}