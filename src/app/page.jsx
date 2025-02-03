"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const FilterPage = () => {
  const [makes, setMakes] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_VEHICLE_MAKES_API);
        const data = await res.json();
        setMakes(data.Results);
      } catch (error) {
        console.error("Error retrieving car brands:", error);
      }
    };
    fetchMakes();
  }, []);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) =>
    (2015 + i).toString()
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl text-gray-700 uppercase font-bold mb-6">Car dealer app</h1>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Car brand:
        </label>
        <select
          className="w-full p-2 text-gray-700 border border-gray-300 rounded-md mb-4"
          onChange={(e) => setSelectedMake(e.target.value)}
          value={selectedMake}
        >
          <option value="" disabled>
            Choose a brand
          </option>
          {makes.map((make) => (
            <option key={make.MakeId} value={make.MakeId}>
              {make.MakeName}
            </option>
          ))}
        </select>

        <label className="block text-gray-700 font-semibold mb-2">
          Year of release:
        </label>
        <select
          className="w-full p-2 text-gray-700 border border-gray-300 rounded-md mb-4"
          onChange={(e) => setSelectedYear(e.target.value)}
          value={selectedYear}
        >
          <option value="" disabled>
            Choose a year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {selectedMake && selectedYear ? (
          <Link
            href={`/result/${selectedMake}/${selectedYear}`}
            className="w-full py-2 block text-center rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600"
          >
            Next
          </Link>
        ) : (
          <button
            disabled
            className="w-full py-2 block text-center rounded-md text-white font-semibold bg-gray-400 cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterPage;
