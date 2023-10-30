import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ImageDragAndDrop from "./ImageDragAndDrop";
import Dropdown from "./DropDown";
import {
  createDataAsset,
  fetchDataAsset,
  updateDataAsset,
} from "../service/dataAsset/resDataAsset.js";

import { useSelector } from "react-redux";
import LoadingButton from "./LoadingButton";
import Comboboxes from "./Comboboxes";
import {
  OpMerk,
  OpStnk,
  OpTypeKendaraan,
  OpYear,
  opCondition,
} from "../utils/option/optionValues";

export default function DataKendaraanForm({
  action = "add",
  isLoading = false,
  setShowForm,
  subCategoryOption = [],
  currPage,
  asset = {},
  img = {},
  idOnTabsCategory,
  addNewData,
  setNewAddData,
  ownerG,
  assetName,
}) {
  console.log("aset Kendaraan", asset);
  console.log("subCategoryOption", subCategoryOption);
  // console.log("owner", ownerG);

  const cL = asset && asset.m_category ? asset.m_category.id : "";

  console.log("c1 adalah", cL);
  const assetInsMap = {};

  if (asset.m_assets_ins && asset.m_assets_ins.length > 0) {
    asset.m_assets_ins.forEach((assetIn) => {
      assetInsMap[assetIn.m_form.column_name] = assetIn.value;
    });
  }

  // console.log("assetInMaps Kendaraan", assetInsMap);

  const receivedInBranch = asset.received_in_branch
    ? new Date(asset.received_in_branch).toISOString().split("T")[0]
    : "";

  const expPjkOneYear = asset.exp_pjk_1_thn
    ? new Date(asset.exp_pjk_1_thn).toISOString().split("T")[0]
    : "";

  const expPjkFiveYear = asset.exp_pjk_5_thn
    ? new Date(asset.exp_pjk_5_thn).toISOString().split("T")[0]
    : "";

  const findIdCondition = opCondition.find(
    (item) => item.label === asset.condition
  )?.value;

  const findIdMerk = OpMerk.find(
    (item) => item.name === assetInsMap["Merk"]
  )?.id;

  // console.log("test id merk", findIdMerk);

  const findIdYaer = OpYear.find(
    (item) => item.name === assetInsMap["Year"]
  )?.id;

  const findIdType = OpTypeKendaraan.find(
    (item) => item.name === assetInsMap["Year"]
  )?.id;

  const findIdStnk = OpStnk.find(
    (item) => item.label === assetInsMap["Status Stnk"]
  )?.value;

  const findIdSubCtgr = subCategoryOption.find(
    (item) => item.label === assetInsMap["Sub-Category"]
  )?.value;

  // console.log("find id sub ctgr", findIdSubCtgr);

  const userGlobal = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const [image, setImage] = useState([]);

  // console.log("img run2", image);

  const [selectOwner, setSelectOwner] = useState(
    asset && asset.owner && Object.keys(asset.owner).length > 0
      ? {
          id: asset.owner.id,
          name: asset.owner.name,
        }
      : {}
  );

  const [selectAssetName, setSelectAssetName] = useState({});

  console.log("owner kendaraan adalah", selectOwner);

  const [selectedSubCategory, setSelectedSubCategory] = useState(
    asset && asset.m_sub_category
      ? {
          id: asset.m_sub_category.id,
          name: asset.m_sub_category.name,
        }
      : {}
  );

  // console.log("selected sub category", selectedSubCategory);

  const [selectedCondition, setSelectedCondition] = useState(
    asset.condition
      ? {
          value: findIdCondition,
          label: asset.condition,
        }
      : {}
  );
  const [selectedMerk, setSelectedMerk] = useState(
    assetInsMap
      ? {
          id: findIdMerk,
          name: assetInsMap["Merk"],
        }
      : {}
  );

  const [selectedYear, setSelectedYear] = useState(
    assetInsMap
      ? {
          id: findIdYaer,
          name: assetInsMap["Year"],
        }
      : {}
  );

  // console.log("Select year", selectedYear);

  const [selectedTypeKendaraan, setSelectedTypeKendaraan] = useState(
    asset.tipe_kendaraan
      ? {
          id: findIdType,
          name: asset.tipe_kendaraan,
        }
      : {}
  );

  const [selectedstatusStnk, setSelectedstatusStnk] = useState(
    assetInsMap
      ? {
          value: findIdStnk,
          label: assetInsMap["Status Stnk"],
        }
      : {}
  );

  const [dataAssets, setDataAssets] = useState([]);
  const [assetAdded, setAssetAdded] = useState(false);

  // console.log("assetAdded kendaraan", assetAdded);

  useEffect(() => {
    setImage(
      img && img.length > 0
        ? img.map((item) => ({
            preview: `http://localhost:2000/static/kendaraan/${item.images_url}`,
          }))
        : []
    );
  }, [img]);
  // console.log("userBranc", userGlobal);
  const branchId = userGlobal.id_cabang;
  const userId = userGlobal.id;

  // console.log("branch id ini bro", branchId);

  const title = action[0].toUpperCase() + action.substring(1);

  async function handleSubmit(e) {
    // console.log("submit");
    e.preventDefault();

    // Ambil nilai dari form
    const {
      desc,

      // owner,
      receivedInBranch,
      noPolisi,
      noRangka,
      noMesin,

      warna,
      expTaxOneYear,
      expTaxFiveYear,
    } = e.target;

    const assetName = selectAssetName ? selectAssetName.name : null;

    const ownerId = selectOwner ? selectOwner.id : null;
    const subCategoryId = selectedSubCategory.id;

    const conditionLabel = selectedCondition.label;

    const merkName = selectedMerk.name;

    const yearName = selectedYear.name;

    const typeKendaraanName = selectedTypeKendaraan.name;

    const statusStnkName = selectedstatusStnk.label;

    // const TypeKendaraanName =

    // Buat instance FormData untuk mengumpulkan data yang akan dikirim
    const newAsset = new FormData();

    newAsset.append("name", assetName);
    newAsset.append("CategoryId", idOnTabsCategory);
    newAsset.append("sub_category_id", subCategoryId);
    newAsset.append("ownerId", ownerId);
    newAsset.append("conditionLabel", conditionLabel);
    newAsset.append("statusStnkName", statusStnkName);
    newAsset.append("merk", merkName);
    newAsset.append("year", yearName);
    newAsset.append("noRangka", noRangka?.value);
    newAsset.append("noMesin", noMesin?.value);
    newAsset.append("typeKendaraanName", typeKendaraanName);

    //
    // newAsset.append("owner", owner?.value);
    newAsset.append("noPolisi", noPolisi?.value);
    newAsset.append("expTaxOneYear", expTaxOneYear?.value);
    newAsset.append("expTaxFiveYear", expTaxFiveYear?.value);

    //

    newAsset.append("description", desc?.value);

    newAsset.append("color", warna?.value);
    image.forEach((img, index) => {
      newAsset.append("asset_image", img); // asumsi img adalah File object
      // console.log("testi", img, img instanceof File);
    });

    if (action === "edit") {
      /* Check if the user remove the img, since if the img isn't removed
         the object will have `preview` property */
      if (!Object.keys(image).length) newAsset.append("isImgDeleted", true);
    }

    newAsset.append("branch_id", branchId);
    newAsset.append("userId", userId);

    // ... (tambahkan field lain yang Anda butuhkan)
    for (let [key, value] of newAsset.entries()) {
      // console.log("key value", key, value);
    }

    if (action === "Add") {
      const response = await createDataAsset(newAsset, idOnTabsCategory);
      if (response && response.status === 200) {
        setAssetAdded(!assetAdded); // Mengganti nilai state untuk memicu useEffect
        setNewAddData(true);
        setShowForm(false);
      }
    }
    if (action === "Edit") {
      const response = await updateDataAsset(cL, asset.id, newAsset);
      if (response && response.status === 200) {
        setNewAddData(true);
        setShowForm(false);
      }
    }
  }

  // useEffect(() => {
  //   async function refreshDataAsset() {
  //     const newDataAsset = await fetchDataAsset(idOnTabsCategory);
  //     setDataAssets(newDataAsset);
  //   }

  //   if (assetAdded) {
  //     refreshDataAsset();
  //     // setShowForm(false);
  //   }
  // }, [assetAdded]);

  return (
    <form
      className=" space-y-8 divide-y divide-gray-200 "
      onSubmit={handleSubmit}
    >
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {title} Kendaraan
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {title} asset's information.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="assetName"
                className="block text-sm font-medium text-gray-700"
              >
                Asset Name
              </label>
              <Comboboxes
                people={assetName}
                selectedValue={selectAssetName}
                setSelectedValue={setSelectAssetName}
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="owner"
                className="block text-sm font-medium text-gray-700"
              >
                Name of Owner
              </label>
              <Comboboxes
                people={ownerG}
                selectedValue={selectOwner}
                setSelectedValue={setSelectOwner}
              />
            </div>

            {/* <div className="sm:col-span-2 ">
              <label
                htmlFor="condition"
                className="block text-sm font-medium text-gray-700"
              >
                Condition
              </label>
              <Dropdown
                label="None"
                options={opCondition}
                selectedValue={selectedCondition}
                onChange={setSelectedCondition}
                className="text-sm rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
              />
            </div> */}

            <div className="sm:col-span-6">
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <textarea
                  id="desc"
                  name="desc"
                  rows={3}
                  className="p-2 block w-full rounded-md border border-gray-400 border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  defaultValue={asset.desc}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Write a description about your asset.
              </p>
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="sub_category"
                className="block text-sm font-medium text-gray-700"
              >
                Sub-Category
              </label>

              <Comboboxes
                people={subCategoryOption}
                selectedValue={selectedSubCategory}
                setSelectedValue={setSelectedSubCategory}
              />
              {/* <Dropdown
                label="None"
                options={subCategoryOption}
                selectedValue={selectedSubCategory}
                onChange={setSelectedSubCategory}
                className="text-sm rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
              /> */}
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="tahun"
                className="block text-sm font-medium text-gray-700"
              >
                Merk
              </label>
              <Comboboxes
                people={OpMerk}
                selectedValue={selectedMerk}
                setSelectedValue={setSelectedMerk}
              />
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="tahun"
                className="block text-sm font-medium text-gray-700"
              >
                Year
              </label>
              <Comboboxes
                people={OpYear}
                selectedValue={selectedYear}
                setSelectedValue={setSelectedYear}
              />
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="noPolisi"
                className="block text-sm font-medium text-gray-700"
              >
                No. Polisi
              </label>
              <input
                type="text"
                // min="0"
                name="noPolisi"
                id="noPolisi"
                className="p-2 border border-gray-400 spin-hidden block  w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["No. Polisi"]}
              />
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="noRangka"
                className="block text-sm font-medium text-gray-700"
              >
                No. Rangka
              </label>
              <input
                type="text"
                // min="0"
                name="noRangka"
                id="noRangka"
                className="p-2 border border-gray-400 spin-hidden block  w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["No. Rangka"]}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="noMesin"
                className="block text-sm font-medium text-gray-700"
              >
                No. Mesin
              </label>
              <input
                type="text"
                // min="0"
                name="noMesin"
                id="noMesin"
                className="p-2 border border-gray-400 spin-hidden block  w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["No. Mesin"]}
              />
            </div>
            {/* <div className="sm:col-span-2 ">
              <label
                htmlFor="tahun"
                className="block text-sm font-medium text-gray-700"
              >
                Tipe Kendaraan
              </label>
              <Comboboxes
                people={OpTypeKendaraan}
                selectedValue={selectedTypeKendaraan}
                setSelectedValue={setSelectedTypeKendaraan}
              />
            </div> */}
            <div className="sm:col-span-2">
              <label
                htmlFor="warna"
                className="block text-sm font-medium text-gray-700"
              >
                Warna
              </label>
              <input
                type="text"
                // min="0"
                name="warna"
                id="warna"
                className="p-2 border border-gray-400 spin-hidden block  w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["Warna"]}
              />
            </div>
            {/* {(userGlobal.role !== "superadmin" || action === "edit") && ( */}
            {/* <div className="sm:col-span-2">
              <label
                htmlFor="qty"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                min="0"
                name="qty"
                id="qty"
                className="p-2 border border-gray-400 spin-hidden block w-full min-w-0 flex-1 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                // defaultValue={asset.m_stock.quantity}
              />
            </div> */}
            <div className="sm:col-span-2">
              <label
                htmlFor="expTaxOneYear"
                className="block text-sm font-medium text-gray-700"
              >
                Exp Tanggal Pajak 1 Tahun
              </label>
              <input
                type="date"
                name="expTaxOneYear"
                id="expTaxOneYear"
                className="p-2 block w-full min-w-0 flex-1 rounded-md border border-gray-300 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["Exp tgl Pajak 1 Tahun"]}
                // required
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="receivedInBranch"
                className="block text-sm font-medium text-gray-700"
              >
                Exp Tanggal Pajak 5 Tahun
              </label>
              <input
                type="date"
                name="expTaxFiveYear"
                id="expTaxFiveYear"
                className="p-2 block w-full min-w-0 flex-1 rounded-md border border-gray-300 focus:ring-orange-500 sm:text-sm"
                defaultValue={assetInsMap["Exp tgl Pajak 5 Tahun"]}
                // required
              />
            </div>
            <div className="sm:col-span-2 ">
              <label
                htmlFor="statusStnk"
                className="block text-sm font-medium text-gray-700"
              >
                Status Stnk
              </label>
              <Dropdown
                label="None"
                options={OpStnk}
                selectedValue={selectedstatusStnk}
                onChange={setSelectedstatusStnk}
                className="text-sm rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
              />
            </div>
            {/* )} */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Asset Image
              </label>
              <ImageDragAndDrop
                className="mt-1"
                image={image}
                setImage={setImage}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
          {isLoading ? (
            <LoadingButton className="ml-3" />
          ) : (
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-amber-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
