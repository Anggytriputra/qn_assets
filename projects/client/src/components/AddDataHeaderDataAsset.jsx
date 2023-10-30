import { PlusIcon } from "@heroicons/react/20/solid";
import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

export default function AddDataHeaderDataAsset({
  title,
  desc,
  addButtonText,
  addButtonText2,
  addButtonText3,
  onAddClick,
  onAddClick2,
  onAddClick3,
}) {
  const userGlobal = useSelector((state) => state.user);

  let isHidden = false;

  if (
    (userGlobal.role === "Manager Logistik" ||
      userGlobal.role === "Admin Logistik" ||
      userGlobal.role === "Logistik") &&
    userGlobal.cabang_name === "HARMONI PUSAT"
  ) {
    isHidden = true;
  } else if (userGlobal.role === "Super Admin") {
    isHidden = true;
  } else {
    isHidden = false;
  }

  console.log("ishiden", isHidden);
  return (
    <div className="sm:flex sm:items-center ml-4 mr-4 py-6">
      <div className=" sm:flex-auto ">
        <h1 className="text-2xl relative font-semibold  w-max text-gray-900 after:block after:bg-red-300 after:absolute  after:bottom-1 after:-z-10 after:left-0 after:right-0">
          {title}
        </h1>
        <p className="mt-4 text-sm text-gray-700">{desc}</p>
      </div>

      {isHidden && (
        <div className="mt-2 sm:mt-0 sm:ml-16 sm:flex-none py-1">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            onClick={onAddClick}
          >
            <PlusIcon
              className="-ml-1 mr-2 h-5 w-5"
              aria-hidden="true"
            />
            {addButtonText}
          </button>
        </div>
      )}

      <div className="mt-1 sm:mt-0 sm:ml-2 sm:flex-none">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          onClick={onAddClick2}
        >
          <RocketLaunchIcon
            className="-ml-1 mr-2 h-5 w-5"
            aria-hidden="true"
          />
          {addButtonText2}
        </button>
      </div>
      <div className="mt-1 sm:mt-0 sm:ml-2 sm:flex-none">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          onClick={onAddClick3}
        >
          <RocketLaunchIcon
            className="-ml-1 mr-2 h-5 w-5"
            aria-hidden="true"
          />
          {addButtonText3}
        </button>
      </div>
    </div>
  );
}
