import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const people = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    role: "Member",
  },
  // More people...
];
export default function TableBodyWithIcon() {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {people.map((person) => (
        <tr
          key={person.email}
          className="divide-x divide-gray-200"
        >
          <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6">
            {person.name}
          </td>
          <td className="whitespace-nowrap p-4 text-sm text-gray-500">
            {person.title}
          </td>
          {/* <td className="whitespace-nowrap p-4 text-sm text-gray-500">
              {person.email}
            </td> */}
          <td className="whitespace-nowrap py-4 pl-4 pr-2 text-sm text-gray-500 sm:pr-2">
            <button
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
              onClick={() => {
                // onEdit(assets);
                // setActionSend("Edit");
              }}
            >
              <EyeIcon className="w-6 h-5 font-semibold text-gray-50" />
              {/* <span className="sr-only">{assets.name}</span> */}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto ml-1"
              // onClick={() => onDelete(assets.id)}
            >
              <PencilSquareIcon className="w-6 h-5 font-semibold text-gray-50" />
              {/* <span className="sr-only">{assets.name}</span> */}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto ml-1"
              // onClick={() => onDelete(assets.id)}
            >
              <TrashIcon className="w-6 h-5 font-semibold text-gray-50" />
              {/* <span className="sr-only">{assets.name}</span> */}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
