import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  handleCheckboxChange,
  handleQtyChange,
  searchAssetForm,
  transformData,
  updateStepStatus,
} from "../../helper/globalFunction";

import {
  stepsForOtherCategories,
  stepsForStandardSafetyTools,
} from "../../constant/detailSteps";

import {
  fetchCategories,
  fetchSubCategories,
} from "../../reducers/categorySlice";

import { fetchAllBranches } from "../../reducers/branchSlice";
import { fetchAllAsset, fetchAssetNoPolSN } from "../../reducers/assetSlice";
import { fetchAssetNameByCategor } from "../../reducers/assetNameSlice";
import { fetchAllOwner } from "../../reducers/ownerSlice";
import { fetchAllUsers } from "../../reducers/allUsersSlice";
import {
  createDataAsset,
  updateDataAsset,
} from "../../service/dataAsset/resDataAsset";
import { errorAlertWithMessage } from "../../helper/alerts";
import { reqTransferAsset } from "../../reducers/transferSlice";
import Spinner from "../../components/Spinner";
import Modal4 from "../../components/Modal4";
import Steppers from "../../components/Steppers";
import FormFirstStep from "../../components/formStep/FormFirstStep";
import FormSecondStep from "../../components/formStep/FormSecondStep";
import FormThirdStep from "../../components/formStep/FormThirdStep";
import ModalForm2 from "../../components/Modal2";
import TableBodyListTransferAsset from "../../components/tableBodyTransAsset/TableBodyListTransferAsset";
import AddDataHeaderDataAsset from "../../components/AddDataHeaderDataAsset";
import SearchBar from "../../components/SearchBar";
import Comboboxes from "../../components/Comboboxes";
import Table2 from "../../components/Table2";
import TableBodyAsset from "../../components/tableBodyDataAsset/TableBodyAsset";
import Pagination2 from "../../components/Pagination2";
import {
  OpMerk,
  OpMerkSpecialTools,
  OpStnk,
  OpTipeSpecialTools,
  OpYear,
  opCondition,
} from "../../utils/option/optionValues";
import Testing3 from "../../components/componentTest/Testing3";
import { fetchMerkByCategoryId } from "../../reducers/optionSlice";
import TableBodyListReturnAsset from "../../components/formReturnAsset/TableBodyListReturnAsset";
import { fetchStatusReturn } from "../../reducers/statusSlice";
import { reqReturnAsset } from "../../reducers/returnSlice";

const branchOptions = [{ id: "", name: "ALL BRANCH" }];
const categoryOptions = [{ id: "", name: "None" }];
const snNoPolOption = [{ id: "", name: "ALL SN NOPOL" }];

const DataAsset = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [actionSend, setActionSend] = useState("");
  // console.log("action adalah", actionSend);
  const formikRef = useRef();

  // console.log("actionSend", actionSend);

  const [currentPage, setCurrentPage] = useState(1);
  const [addNewData, setAddNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalTf, setOpenModalTf] = useState(false);
  const [openModalRt, setOpenModalRt] = useState(false);
  // const [openModalTf, setOpenModalTf] = useState(false);

  // filter
  const [searchAssetName, setSearchAssetName] = useState("");
  // console.log("testimoni search", searchAssetName);

  //
  const [dataAsset, setDataAsset] = useState([]);
  // console.log("ini data asset", dataAsset);

  const [editedAssetData, setEditedAssetData] = useState();

  const [actionEdit, setActionEdit] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [loadingData, setLoadingData] = useState(false);

  // Sort
  const [sortBranch, setSortBranch] = useState(branchOptions[0]);
  const [sortCategory, setSortCategory] = useState(categoryOptions[0]);
  const [sortNoPolSN, setSortNoPolSN] = useState(snNoPolOption[0]);
  //
  const [selectedCategory, setSelectedCategory] = useState();

  const [selectedBrach, setSelectedBranch] = useState();
  const [selectedAssetName, setSelectedAssetName] = useState();
  const [selectedOwner, setSelectedOwner] = useState();
  const [selectedPic, setSelectedPic] = useState();
  const [qty, setQty] = useState();
  const [desc, setDesc] = useState("");

  // Kendaraan
  const [selectedSubCategory, setSelectedSubCategory] = useState();
  const [selectedOpMerk, setSelectedOpMerk] = useState();
  const [selectedOpStnk, setSelectedOpStnk] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [selectedCondition, setSelectedCondition] = useState();
  const [noPolisi, setNoPolisi] = useState("");

  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNomesin] = useState("");
  const [color, setColor] = useState("");
  const [expOneYear, setExpOneYear] = useState("");
  const [expFiveYear, setExptFiveYear] = useState("");

  // UseState Special Tools
  const [selectedMerkST, setSelectedMerkST] = useState();
  const [selectedTipeST, setSelectedTipeST] = useState();
  const [serialNumber, setSerialNumber] = useState("");

  const [accesoriesOne, setAccesoriesOne] = useState("");
  const [accesoriesTwo, setAccesoriesTwo] = useState("");
  const [accesoriesThree, setAccesoriesThree] = useState("");
  //REDUX
  const AssetGlobal = useSelector((state) => state.asset);

  const userGlobal = useSelector((state) => state.user);
  const categoriesGlobal = useSelector((state) => state.category.categories);
  const allBranchGlobal = useSelector((state) => state.branch);
  const assetNameGlobal = useSelector((state) => state.assetName);
  const ownerGlobal = useSelector((state) => state.owner);
  const allUserGlobal = useSelector((state) => state.allUsers);
  const subCategoryGlobal = useSelector((state) => state.category);
  const optionGlobal = useSelector((state) => state.option);

  // redux return
  const statusReturnGlobal = useSelector((state) => state.status);

  //Transfer
  const isSuperAdmin = userGlobal.role === "Super Admin";
  const [selectedItemTf, setSelectedItemTf] = useState([]);
  const [qtyInputTf, setQtyInputTf] = useState([]);
  // console.log("qty transfer", qtyInputTf);

  const [selectedFromBranch, setSelectedFromBranch] = useState(
    userGlobal.role === "Super Admin"
      ? null
      : {
          id: userGlobal.id_cabang,
          name: userGlobal.cabang_name,
        }
  );

  const [selectedToBranch, setSelectedToBranch] = useState();
  const [selectedUserPenerima, setSelectedUserPenerima] = useState();

  // Return
  const [selectedToBranchRt, setSelectedToBranchRt] = useState({
    id: 17,
    name: "HARMONI PUSAT",
  });
  const [selectedStatusReturn, setSelectedStatusReturn] = useState();

  const listTf = selectedItemTf.map(transformData);

  const steps =
    selectedCategory &&
    ["Safety Tools", "Standard Tools"].includes(selectedCategory.name)
      ? stepsForStandardSafetyTools
      : stepsForOtherCategories;

  const updatedSteps = updateStepStatus(currentStep, steps);

  useEffect(() => {
    if (!openModal) {
      setCurrentStep(0);
      setSelectedCategory("");
      setActionSend("");

      // formfirsstep
      setSelectedCategory("");
      setSelectedBranch("");

      //FormSecondStep
      setSelectedAssetName("");
      setSelectedOwner("");
      setQty("");
      setDesc("");
      setSelectedPic("");

      // FormThirdStep
      setSelectedSubCategory("");
      setSelectedOpMerk("");
      setSelectedOpStnk("");
      setSelectedYear("");
      setSelectedCondition("");
      setNoPolisi("");
      setNomesin("");
      setNoRangka("");
      setColor("");
      setExpOneYear("");
      setExptFiveYear("");
    }
  }, [openModal]);

  useEffect(() => {
    if (!openModalTf) {
      setQtyInputTf([]);
    }
  }, [openModalTf]);

  useEffect(() => {
    if (actionEdit && editedAssetData) {
      let assetInMaps = {};

      const assetInsForEach = searchAssetForm(editedAssetData, assetInMaps);
      // console.log("assetInMaps", assetInMaps);

      setSelectedCategory(editedAssetData ? editedAssetData.m_category : null);
      setSelectedBranch(
        editedAssetData && editedAssetData.m_cabang
          ? {
              id: editedAssetData.m_cabang.id,
              name: editedAssetData.m_cabang.cabang_name,
            }
          : null
      );

      // Global
      setSelectedAssetName(editedAssetData ? editedAssetData : null);
      setSelectedOwner(editedAssetData ? editedAssetData.owner : null);
      setSelectedPic(
        editedAssetData && editedAssetData.pic_user
          ? {
              id: editedAssetData.pic_user.id,
              name: editedAssetData.pic_user.username,
            }
          : null
      );
      setQty(
        editedAssetData && editedAssetData.m_stock
          ? editedAssetData.m_stock.quantity
          : null
      );

      setDesc(editedAssetData ? editedAssetData.desc : null);

      // Special tools
      setSelectedSubCategory(
        editedAssetData && editedAssetData.m_sub_category
          ? editedAssetData.m_sub_category
          : null
      );
      setSelectedMerkST(
        editedAssetData ? { id: 1, name: assetInMaps["Merk"] } : null
      );

      setSerialNumber(
        editedAssetData && assetInMaps ? assetInMaps["Serial Number"] : null
      );

      setAccesoriesOne(
        editedAssetData && assetInMaps ? assetInMaps["Accessories 1"] : null
      );
      setAccesoriesTwo(
        editedAssetData && assetInMaps ? assetInMaps["Accessories 2"] : null
      );
      setAccesoriesThree(
        editedAssetData && assetInMaps ? assetInMaps["Accessories 3"] : null
      );

      // Kendaraan
      setSelectedOpMerk(
        editedAssetData ? { id: 1, name: assetInMaps["Merk"] } : null
      );

      setSelectedYear(
        editedAssetData ? { id: 1, name: assetInMaps["Year"] } : null
      );

      setNoPolisi(editedAssetData ? assetInMaps["No. Polisi"] : null);
      setNoRangka(editedAssetData ? assetInMaps["No. Rangka"] : null);
      setNomesin(editedAssetData ? assetInMaps["No. Mesin"] : null);
      setColor(editedAssetData ? assetInMaps["Warna"] : null);
      setExpOneYear(
        editedAssetData ? assetInMaps["Exp tgl Pajak 1 Tahun"] : null
      );
      setExptFiveYear(
        editedAssetData ? assetInMaps["Exp tgl Pajak 5 Tahun"] : null
      );
      setSelectedOpStnk(
        editedAssetData ? { value: 1, label: assetInMaps["Status Stnk"] } : null
      );
    }
  }, [actionEdit, editedAssetData, openModal]);

  // const branchId = userGlobal.id_cabang;
  // const userRole = userGlobal.role

  const q = {
    branchId: userGlobal.id_cabang,
    role: userGlobal.role,
  };
  // useEffect fecth data
  useEffect(() => {
    if (userGlobal.role) {
      dispatch(fetchCategories());
      dispatch(fetchAllBranches());
      dispatch(fetchAssetNoPolSN(q));
      dispatch(fetchStatusReturn());
    }

    // query by searchparams
    let query = `page=${currentPage}`;
    searchAssetName
      ? searchParams.set("q", searchAssetName)
      : searchParams.delete("q");
    sortBranch.id
      ? searchParams.set("sortBranch", sortBranch.id)
      : searchParams.delete("sortBranch");
    sortCategory.id
      ? searchParams.set("sortCategory", sortCategory.id)
      : searchParams.delete("sortCategory");
    sortNoPolSN.name
      ? searchParams.set("sortNoPolSN", sortNoPolSN.name)
      : searchParams.delete("sortNoPolSN");

    query += `&${searchParams.toString()}`;
    setSearchParams(searchParams);

    dispatch(fetchAllAsset(query));
    setAddNewData(false);
  }, [
    dispatch,
    userGlobal.role,
    searchAssetName,
    currentPage,
    // addNewData,
    sortBranch,
    sortCategory,
    sortNoPolSN,
  ]);

  useEffect(() => {
    if (userGlobal.role && selectedCategory && selectedBrach) {
      dispatch(fetchAssetNameByCategor(selectedCategory.id));
      dispatch(fetchAllOwner());
      dispatch(fetchAllUsers(selectedBrach.id));
      dispatch(fetchMerkByCategoryId(selectedCategory.id));
    }
  }, [userGlobal.role, selectedCategory, selectedBrach, sortBranch]);

  useEffect(() => {
    if (selectedToBranch && selectedToBranch.id) {
      dispatch(fetchAllUsers(selectedToBranch.id));
    } else if (selectedBrach) {
      dispatch(fetchAllUsers(selectedBrach.id));
    } else if (openModalRt) {
      dispatch(fetchAllUsers(selectedToBranchRt.id));
    }
  }, [selectedToBranch, selectedBrach, selectedCategory, openModalRt]);

  useEffect(() => {
    if (
      userGlobal.role &&
      selectedCategory &&
      selectedBrach &&
      selectedAssetName &&
      selectedOwner
    ) {
      dispatch(fetchSubCategories(selectedCategory.id));
    }
  }, [
    userGlobal.role,
    selectedCategory,
    selectedBrach,
    selectedAssetName,
    selectedOwner,
  ]);

  //  Data Manipulation
  const updatedCategories = categoriesGlobal.map((category) => ({
    id: category.id,
    name: category.name_ctgr,
  }));

  categoryOptions.splice(1, categoryOptions.length - 1, ...updatedCategories);

  const updatedBranch = allBranchGlobal.allBranches.map((branch) => ({
    id: branch.id,
    name: branch.cabang_name,
  }));

  branchOptions.splice(1, branchOptions.length - 1, ...updatedBranch);

  let branchIsDis;
  let isHiden = false;
  if (
    (userGlobal.role === "Manager Logistik" ||
      userGlobal.role === "Admin Logistik" ||
      userGlobal.role === "Logistik") &&
    userGlobal.cabang_name === "HARMONI PUSAT"
  ) {
    branchIsDis = branchOptions;
    isHiden = true;
  } else if (userGlobal.role === "Super Admin") {
    branchIsDis = branchOptions;
    isHiden = true;
  } else {
    branchIsDis = {};
    isHiden = false;
  }

  const allNoPolSN = AssetGlobal
    ? AssetGlobal.noPolSN.map((asset, index) =>
        asset.m_assets_ins.map((assetIn) => ({
          id: index,
          name: assetIn.value,
        }))
      )
    : [];

  const flattenedAllNoPolSN = allNoPolSN.flat();
  snNoPolOption.splice(1, snNoPolOption.length - 1, ...flattenedAllNoPolSN);

  const updatedAllUsers = allUserGlobal.users.map((user) => ({
    id: user.id,
    name: user.username,
    branchId: user.id_cabang,
  }));

  function handleSubmitSearch(e) {
    e.preventDefault();
    setSearchAssetName(e.target.searchBar?.value);
  }

  async function handleSubmit() {
    const id = selectedCategory ? selectedCategory.id : "";
    const assetId = editedAssetData ? editedAssetData.id : null;

    const data = {
      name: selectedAssetName?.name || null,
      CategoryId: selectedCategory?.id || null,
      pic: selectedPic?.id || null,
      branchId: selectedBrach?.id || null,
      sub_category_id: selectedSubCategory?.id || null,
      ownerId: selectedOwner?.id || null,
      quantity: qty,
      description: desc || null,
    };

    let mergedData = {};

    if (selectedCategory && selectedCategory.name === "Kendaraan") {
      const DataKd = {
        statusStnkName: selectedOpStnk?.label || null,
        merk: selectedOpMerk?.name || null,
        year: selectedYear?.name || null,
        noRangka: noRangka || null,
        noMesin: noMesin || null,
        noPolisi: noPolisi || null,
        expTaxOneYear: expOneYear || null,
        expTaxFiveYear: expFiveYear || null,
        color: color || null,
      };
      mergedData = { ...data, ...DataKd };
    } else if (selectedCategory && selectedCategory.name === "Special Tools") {
      const DataST = {
        serialNumber: serialNumber || null,
        typeName: selectedTipeST?.name || null,
        merkName: selectedMerkST?.name || null,
        AccessoriesOne: accesoriesOne || null,
        AccessoriesTwo: accesoriesTwo || null,
        AccessoriesThree: accesoriesThree || null,
      };
      mergedData = { ...data, ...DataST };
    } else {
      // Jika kategori bukan Kendaraan atau Special Tools, gunakan data saja
      mergedData = data;
      // console.log("merged data", mergedData);
    }

    let result;
    if (actionSend === "Add") {
      // console.log("berhasil manambahkan data");
      result = await createDataAsset(mergedData, id);
    } else if (actionSend === "Edit") {
      // console.log("Berhasil edit");
      result = await updateDataAsset(mergedData, assetId, id);
    } else {
      errorAlertWithMessage("Action failed");
    }

    if (result && result.status === 200) {
      setTimeout(() => {
        setAddNewData(true);
        setOpenModal(false);
      }, 3000);
    }

    // console.log("result", result);
  }

  // Handle edit
  function handleEditClick(assets, stockIdx) {
    // console.log("nih data asset edited", assets);
    setEditedAssetData(assets);
    setActionEdit(true);
    setOpenModal(true);
  }

  const qtyInputArray = Object.values(qtyInputTf);
  // console.log("qtyInputArray", qtyInputArray);

  const processedQtyInputArray = qtyInputArray.map((item) => ({
    assetId: item.assetId,
    assetName: item.name,
    branchAsset: item.branchAsset,
    categoryId: item.categoryId,
    coditionAssetId: item.statusConditionId,
    selectQty: item.selectQty === "" ? null : item.selectQty,
    ownerId: item.ownerId,
  }));

  async function handleSubmitTransfer(e) {
    e.preventDefault();
    if (formikRef.current) {
      formikRef.current.submitForm(); // Trigger submit Formik secara manual
      // console.log("ini formik", formikRef);
    }
    const desc = e.target.desc.value || null;
    const date = e.target.date.value || null;

    const userIdPenerima = selectedUserPenerima
      ? selectedUserPenerima.id
      : null;
    const fromBranch = selectedFromBranch ? selectedFromBranch.name : null;
    const toBranch = selectedToBranch ? selectedToBranch.name : null;

    dispatch(
      reqTransferAsset({
        processedQtyInputArray,
        listTf,
        date: date,
        userIdPenerima: userIdPenerima,
        toBranch: toBranch,
        fromBranch: fromBranch,
        desc: desc,
      })
    ).then((response) => {
      if (response && response.status === 200) {
        setOpenModalTf(false);
      }
      setAddNewData(false);
    });
  }

  async function handleSubmitReturn(e) {
    e.preventDefault();
    if (formikRef.current) {
      formikRef.current.submitForm(); // Trigger submit Formik secara manual
      // console.log("ini formik", formikRef);
    }

    const desc = e.target.desc.value || null;
    const date = e.target.date.value || null;

    const userIdPenerima = selectedUserPenerima
      ? selectedUserPenerima.id
      : null;
    const fromBranch = selectedFromBranch ? selectedFromBranch.name : null;
    const destination = selectedToBranchRt ? selectedToBranchRt.name : null;
    const statusReturnId = selectedStatusReturn
      ? selectedStatusReturn.id
      : null;

    dispatch(
      reqReturnAsset({
        processedQtyInputArray,
        listTf,
        date: date,
        userIdPenerima: userIdPenerima,
        fromBranch: fromBranch,
        destination: destination,
        desc: desc,
        statusReturnId: statusReturnId,
      })
    ).then((response) => {
      if (response && response.status === 200) {
        setOpenModalRt(false);
      }
      setAddNewData(false);
    });
  }

  if (
    AssetGlobal.isLoading ||
    !(AssetGlobal.allAsset && AssetGlobal.allAsset.asset)
  )
    return <Spinner />;

  return (
    <div>
      {/* <CompTesting2 /> */}
      <div>
        <Modal4
          open={openModal}
          setOpen={setOpenModal}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          title="modal nih"
          action="Add"
          steps={updatedSteps}
          onSubmit={handleSubmit}
          children={
            <div>
              <Steppers steps={steps} />
              {currentStep === 0 && (
                <FormFirstStep
                  actionSend={actionSend}
                  dataEdited={editedAssetData}
                  categories={updatedCategories}
                  allbranch={updatedBranch}
                  selectCategory={selectedCategory}
                  setSelectCategory={setSelectedCategory}
                  selectBranch={selectedBrach}
                  setSelectBranch={setSelectedBranch}
                />
              )}
              {currentStep === 1 && (
                <FormSecondStep
                  actionSend={actionSend}
                  allAssetName={assetNameGlobal.assetName}
                  selectAssetName={selectedAssetName}
                  setSelectAssetName={setSelectedAssetName}
                  allOwner={ownerGlobal.allOwner}
                  selectOwner={selectedOwner}
                  setSelectOwner={setSelectedOwner}
                  qty={qty}
                  setQty={setQty}
                  desc={desc}
                  setDesc={setDesc}
                  allUsers={updatedAllUsers}
                  selectPic={selectedPic}
                  setSelectPic={setSelectedPic}
                />
              )}
              {currentStep === 2 && (
                <FormThirdStep
                  currentCategory={
                    selectedCategory ? selectedCategory.name : ""
                  }
                  subCategory={subCategoryGlobal.subCategories}
                  selectSubCategory={selectedSubCategory}
                  setSelectSubCategory={setSelectedSubCategory}
                  OpMerk={optionGlobal.merk}
                  selectOpOwner={selectedOpMerk}
                  setSelectOpOwner={setSelectedOpMerk}
                  OpStnk={OpStnk}
                  selectOpStnk={selectedOpStnk}
                  setSelectOpStnk={setSelectedOpStnk}
                  OpYear={OpYear}
                  selectYear={selectedYear}
                  setSelectYear={setSelectedYear}
                  opCondition={opCondition}
                  selectCondition={selectedCondition}
                  setSelectCondition={setSelectedCondition}
                  selectNoPolisi={noPolisi}
                  setSelectNoPolisi={setNoPolisi}
                  selectNoMesin={noMesin}
                  setSelectNoMesin={setNomesin}
                  selectNoRangka={noRangka}
                  setSelectNorangka={setNoRangka}
                  selectColor={color}
                  setSelectColor={setColor}
                  selectExpOneYear={expOneYear}
                  setSelectExpOneYear={setExpOneYear}
                  selectExpFiveYear={expFiveYear}
                  setSelectFiveYear={setExptFiveYear}
                  //
                  // Special Tools
                  sN={serialNumber}
                  setSN={setSerialNumber}
                  oPMerkST={optionGlobal.merk}
                  selectMerkST={selectedMerkST}
                  setSelectMerkST={setSelectedMerkST}
                  oPTipeST={OpTipeSpecialTools}
                  selectTipeST={selectedTipeST}
                  setSelectTipeST={setSelectedTipeST}
                  accOne={accesoriesOne}
                  setAccOne={setAccesoriesOne}
                  accTwo={accesoriesTwo}
                  setAccTwo={setAccesoriesTwo}
                  accThree={accesoriesThree}
                  setAccThree={setAccesoriesThree}
                />
              )}
            </div>
          }
        />
      </div>
      <div>
        <ModalForm2
          title="List Transfer Assets"
          open={openModalTf}
          setOpen={setOpenModalTf}
          action="Add"
          onSubmit={handleSubmitTransfer}
          children={
            <TableBodyListTransferAsset
              // TF
              formikRef={formikRef}
              actionSend={actionSend}
              isSuperAdmin={isSuperAdmin}
              asset={listTf}
              allBranch={updatedBranch}
              allUsers={updatedAllUsers}
              selectfromBranch={selectedFromBranch}
              setSelectFromBranch={setSelectedFromBranch}
              selectToBranch={selectedToBranch}
              setSelectToBranch={setSelectedToBranch}
              selectUserPenerima={selectedUserPenerima}
              setSelectUserPenerima={setSelectedUserPenerima}
              qtyInputTf={qtyInputTf}
              setQtyInputTf={setQtyInputTf}
              //function
              handleQtyChange={handleQtyChange}
            />
          }
        />
      </div>
      <div>
        <ModalForm2
          title="List Return Assets"
          open={openModalRt}
          setOpen={setOpenModalRt}
          action="Add"
          onSubmit={handleSubmitReturn}
          children={
            <TableBodyListReturnAsset
              // Return
              formikRef={formikRef}
              isSuperAdmin={isSuperAdmin}
              asset={listTf}
              statusreturn={statusReturnGlobal.statusReturn}
              selectStatusReturn={selectedStatusReturn}
              setSelectStatusReturn={setSelectedStatusReturn}
              allBranch={updatedBranch}
              allUsers={updatedAllUsers}
              selectfromBranch={selectedFromBranch}
              setSelectFromBranch={setSelectedFromBranch}
              selectToBranch={selectedToBranchRt}
              setSelectToBranch={setSelectedToBranchRt}
              selectUserPenerima={selectedUserPenerima}
              setSelectUserPenerima={setSelectedUserPenerima}
              qtyInputTf={qtyInputTf}
              setQtyInputTf={setQtyInputTf}
              //function
              handleQtyChange={handleQtyChange}
            />
          }
        />
      </div>

      <div>
        <AddDataHeaderDataAsset
          title="Data Asset"
          desc="A list Asset PT. Quantum Nusatama"
          addButtonText="Add Asset"
          addButtonText2="Transfer Asset"
          addButtonText3="Return Asset"
          onAddClick={() => {
            setOpenModal(true);
            setActionSend("Add");
          }}
          onAddClick2={() => setOpenModalTf(true)}
          onAddClick3={() => setOpenModalRt(true)}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 mt-12 border-b border-gray-200">
          <SearchBar
            onSubmit={handleSubmitSearch}
            defaultValue={searchAssetName}
          />
          <div className="flex gap-2 items-center flex-wrap">
            <Comboboxes
              people={snNoPolOption}
              selectedValue={sortNoPolSN}
              setSelectedValue={setSortNoPolSN}
            />

            {isHiden && (
              <Comboboxes
                people={branchIsDis}
                selectedValue={sortBranch}
                setSelectedValue={setSortBranch}
              />
            )}
            <Comboboxes
              people={categoryOptions}
              selectedValue={sortCategory}
              setSelectedValue={setSortCategory}
            />
          </div>
        </div>

        <div>
          <Table2
            className="mb-4"
            headCols={[
              // "",
              "Asset Name",
              "Branch",
              "Category",
              "NoPol/SN",
              "Quantity",
              "Status",
            ]}
            tableBody={
              <TableBodyAsset
                // userGlobal={userGlobal}
                onEdit={handleEditClick}
                setActionSend={setActionSend}
                asset={AssetGlobal.allAsset.asset}
                selectItem={selectedItemTf}
                setSelectItem={setSelectedItemTf}
                onCheckboxChange={handleCheckboxChange}
              />
            }
          />
          <Pagination2
            itemsInPage={AssetGlobal.allAsset.asset.length}
            totalItems={AssetGlobal.allAsset.totalItems}
            totalPages={AssetGlobal.allAsset.totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default DataAsset;
