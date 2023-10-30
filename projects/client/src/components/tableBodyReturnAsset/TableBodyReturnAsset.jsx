// import { numToIDRCurrency } from "../helper/currency";
import { Link } from "react-router-dom";
import BrokenImg from "../../assets/broken_img.png";

export default function TableBodyReturnAsset({
  asset = [],
  setOpenModalConfirmed,
  setNoidTH,
  setDetailApp,
  // onEdit,
  // onDelete,
}) {
  console.log("TableBodyTransferAsset", asset);
  console.log("setnoidTh", setNoidTH);

  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {asset.map((assets, stockIdx) => (
        // assets.transD.map((transD, stockIdx) => (
        <tr key={assets.id}>
          <td className="px-3 py-4 text-sm text-blue-500 ">
            <Link
              to={`/asset-tools/Detail-Return/${assets.id}`}
              state={{ asset: assets }}
              className="relative group"
            >
              <div className=" text-blue-400 hover:text-blue-900">
                {assets.no_return}
              </div>
            </Link>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.date}</div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.transD[0].assetName}</div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">
              {assets.transD[0].category_name}
            </div>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.cabang_in}</div>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.cabang_out}</div>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 truncate max-w-[90px]">
              {assets.desc}
            </div>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 truncate max-w-[90px]">
              {assets.desc_received || "-"}
            </div>
          </td>

          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.status_return}</div>
          </td>

          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            <span
              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                assets.status_name === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : assets.status_name === "Rejected"
                  ? "bg-red-100 text-red-500"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {assets.status_name}
            </span>
          </td>

          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            {assets.status_name !== "Received" &&
              assets.status_name !== "Rejected" && (
                <button
                  className="text-teal-600 hover:text-teal-900"
                  onClick={() => {
                    setOpenModalConfirmed(true);
                    setNoidTH(assets.id);
                    const clickedAsset = asset[stockIdx];
                    setDetailApp(clickedAsset);
                  }}
                >
                  Confirmed
                  <span className="sr-only">{assets.no_transfer}</span>
                </button>
              )}
          </td>
        </tr>
        // )
      ))}
    </tbody>
  );
}
