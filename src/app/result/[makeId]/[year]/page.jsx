import Loader from "@/components";
import { Suspense } from "react";

export async function generateStaticParams() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2014 }, (_, i) =>
    (2015 + i).toString()
  );

  const makesRes = await fetch(process.env.NEXT_PUBLIC_VEHICLE_MAKES_API);
  const makesData = await makesRes.json();

  return makesData.Results.flatMap((make) =>
    years.map((year) => ({
      makeId: make.MakeId.toString(),
      year,
    }))
  );
}
async function getVehicleModels(makeId, year) {
  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );
    const data = await res.json();
    console.log(data);
    return data.Results;
  } catch (error) {
    console.error("Error retrieving car brands:", error);
  }
}

const ModelsList = async ({ makeId, year }) => {
  const models = await getVehicleModels(makeId, year);
  if (!models || models.length === 0) {
    return <p className="text-center text-red-500">No car models available</p>;
  }

  return (
    <ul className="list-disc list-inside">
      {models.map((model, index) => (
        <li key={index} className="p-2 border-b last:border-none">
          {model.Make_Name} {model.Model_Name}
        </li>
      ))}
    </ul>
  );
};

export default async function ResultPage({ params }) {
  const makeId = await params.makeId;
  const year = await params.year;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl text-gray-700 font-bold mb-6">
        Car models ({year}) year
      </h1>
      <div className="w-full max-w-md text-gray-700 bg-white shadow-md rounded-lg p-6">
        <Suspense
          fallback={
            <p className="text-center">
              <Loader />
            </p>
          }
        >
          <ModelsList makeId={makeId} year={year} />
        </Suspense>
      </div>
    </div>
  );
}
