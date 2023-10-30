// import { numToIDRCurrency } from "../helper/currency";
import BrokenImg from "../assets/broken_img.png";

export default function AssetKendaraanTableBody({
  asset = [],
  onEdit,
  onDelete,
}) {
  // console.log("assetTableBody", asset);
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {asset.map((assets) => (
        // product.Stocks.map((stock, stockIdx) => (
        <tr key={assets.id}>
          <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 text-gray-500">
            <div className="flex items-center">
              <div className="h-10 w-10 flex-shrink-0">
                <img
                  className="h-10 w-10"
                  src={
                    `http://localhost:2000/static/asset/${assets.images_url}` ||
                    BrokenImg
                  }
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = BrokenImg;
                  }}
                  alt={asset.asset_name}
                />
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900 truncate max-w-[200px]">
                  {assets.asset_name}
                </div>
              </div>
            </div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.category_name}</div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.sub_category_name}</div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900">{assets.desc}</div>
          </td>
          {/* <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 truncate max-w-[90px]">
              {assets.description}
            </div>
          </td> */}
          {/* <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 line-clamp-3">
              {assets.stock || "—"}
            </div>
          </td> */}
          <td className="px-3 py-4 text-sm text-gray-500 text-center">
            <div
              className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                assets.stock > 20
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span className="max-w-[100px] truncate">{assets.quantity}</span>
            </div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 line-clamp-3">
              {assets.cabang_name}
            </div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 line-clamp-3">{assets.no_surat}</div>
          </td>
          <td className="px-3 py-4 text-sm text-gray-500">
            <div className="text-gray-900 line-clamp-3">{assets.warna}</div>
          </td>
          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
            <button
              className="text-teal-600 hover:text-teal-900"
              //   onClick={() => onEdit(assets)}
            >
              Edit<span className="sr-only">{assets.name}</span>
            </button>
            <button
              className="text-red-600 hover:text-red-900 ml-4"
              onClick={() => onDelete(assets.id)}
            >
              Delete
              <span className="sr-only">{assets.name}</span>
            </button>
          </td>
        </tr>
        // )
      ))}
    </tbody>
  );
}
