const { toTitleCase, toUpperCase } = require("../helper/loweUpperCase");
const db = require("../models");
const { Op, where, Sequelize } = require("sequelize");
const sequelize = db.sequelize;

async function getTransAsset(req, res) {
  try {
    console.log("query get tran asset", req.query);
    const itemsPerPage = 6;
    const page = parseInt(req.query.page);

    const roleUser = req.query.role;
    const branchName = req.query.branchName;
    const branchId = parseInt(req.query.branchId);
    const sortBranchId = parseInt(req.query.sortBranch);
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const offsetLimit = {};

    if (page) {
      offsetLimit.limit = itemsPerPage;
      offsetLimit.offset = (page - 1) * itemsPerPage;
    }

    const branchIdClause =
      roleUser === "Super Admin"
        ? {}
        : branchId
        ? {
            [Op.or]: [{ cabang_id_out: branchId }, { cabang_id_in: branchId }],
          }
        : {};

    const branchIdSortClause = sortBranchId
      ? {
          [Op.or]: [
            { cabang_id_out: sortBranchId },
            { cabang_id_in: sortBranchId },
          ],
        }
      : {};

    const dateClause =
      startDate && endDate
        ? {
            date: {
              [Op.between]: [startDate, endDate],
            },
          }
        : startDate
        ? {
            date: {
              [Op.gte]: startDate,
            },
          }
        : endDate
        ? {
            date: {
              [Op.lte]: endDate,
            },
          }
        : {};

    const transH = await sequelize.query(
      `SELECT 
      mth.id, mth.no_transfer,
      mth.date, mth.user_id_penerima,
      mth.desc, mth.desc_received,
      mcIn.cabang_name cabang_out,
      mcIn.id id_cabang_out,
      mcOut.cabang_name cabang_in,
      mcOut.id id_cabang_in,
      mu.username user_transfer,
      mu_rec.username user_received,
      ms.status_name
      FROM m_trans_h mth  LEFT JOIN m_cabang mcIn on mth.cabang_id_out = mcIn.id
    LEFT JOIN m_cabang mcOut on mth.cabang_id_in = mcOut.id
    LEFT JOIN m_users mu on mth.createdBy = mu.id
    LEFT JOIN m_users mu_rec on mth.user_id_penerima = mu_rec.id
    LEFT JOIN m_status ms on mth.m_status_id = ms.id
    `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    // console.log("transH nih bro", transH);

    const transD = await sequelize.query(
      `SELECT 
      mth.id transHId, mth.no_transfer,
      mtd.m_asset_name assetName,
      mtd.serial_number,
      mtd.no_polisi,
      mtd.m_status_condition_id,
      mc.name category_name,
      count(*) as qty_stock
      FROM m_trans_h mth
      left join m_trans_d mtd on mth.id = mtd.m_trans_h_id
      LEFT JOIN m_categories mctr on mtd.m_category_id = mctr.id
      left join m_status_condition msc on mtd.m_status_condition_id = msc.id
      LEFT JOIN m_categories mc on mtd.m_category_id = mc.id
      GROUP BY mtd.m_asset_name , mtd.m_category_id , mtd.m_status_condition_id
      HAVING count(*) > 0;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Menggabungkan data dari kedua kueri berdasarkan ID
    const transfer = transH.map((transHItem) => {
      const correspondingTransD = transD.filter(
        (transDItem) => transDItem.transHId === transHItem.id
      );
      return {
        ...transHItem,
        transD: correspondingTransD.length > 0 ? correspondingTransD : [],
      };
    });

    // console.log("Hasil yang digabungkan:", transfer);

    res.status(200).send({
      message: "SuccessFuly get data transfer asset nih bro",
      transfer,
      // transD,
    });
  } catch (error) {
    console.log("error bro", error);
    return res.status(400).json({ message: error });
  }
}

async function createTransferAsset(req, res) {
  try {
    console.log("req body nih kendaraan", req.body);
    const user = req.user;
    const branchUserLogin = req.branchUser;
    console.log("branchuser login", branchUserLogin);

    const { processedQtyInputArray, listTf, desc, fromBranch, toBranch, date } =
      req.body;

    const userId = parseInt(user.id);
    const qty = parseInt(req.body.qty);
    const userIdPenerima = parseInt(req.body.userIdPenerima);
    const assetId = parseInt(req.body.assetId);

    if (!desc || !userIdPenerima || !fromBranch || !toBranch || !date)
      return res.status(400).send({ message: "Please Complete Your Data" });

    if (processedQtyInputArray.length !== listTf.length) {
      return res.status(400).send({
        message: "Please complete the quantity field or other fields",
      });
    }

    if (
      processedQtyInputArray.some(
        (item) => item.branchAsset !== branchUserLogin.id
      )
    )
      return res.status(400).send({
        message: "Branch asset or user branch is not valid",
      });

    if (toBranch === branchUserLogin.cabang_name)
      return res
        .status(400)
        .send({ message: "Destination branch is not valid" });

    const assetCount = await db.m_assets.findAll({
      attributes: [
        "id", // atau atribut lain yang Anda butuhkan
        "name",
        "desc",
        "m_cabang_id",
        "pic",
        "m_category_id",
        "m_status_condition_id",
        "relocation_status",
      ],
      where: {
        [Op.or]: processedQtyInputArray.map((item) => ({
          name: item.assetName,
          m_category_id: item.categoryId,
          m_cabang_id: item.branchAsset,
          m_status_condition_id: item.coditionAssetId,
          relocation_status: false,
        })),
      },
    });

    const userExist = await db.m_users.findOne({
      where: { id: userIdPenerima, flag_active: true },
      attributes: ["id", "id_karyawan", "username", "flag_active"],
    });

    if (!userExist)
      return res.status(400).send({ message: "Recepitaine not found" });

    const relCabangKaryawan = await db.rel_cabangkaryawan.findOne({
      where: {
        id_karyawan: userExist.dataValues.id_karyawan,
        flag_active: true,
      },
    });

    const branch = await db.m_cabang.findOne({
      where: { cabang_name: toBranch },
    });

    const branch2 = await db.m_cabang.findOne({
      where: { cabang_name: fromBranch },
    });

    const branchInId = branch.dataValues.id;
    const branchOutId = branch2.dataValues.id;

    if (!relCabangKaryawan)
      return res
        .status(400)
        .send({ message: "Recepitaine not found in cabang karyawan" });

    const branchIdPic = relCabangKaryawan.dataValues.id_cabang;
    console.log("branch receiptaine ", branchIdPic);

    if (branchIdPic !== branchInId)
      return res
        .status(400)
        .send({ message: "Recepitaine or branch mismatch" });

    const missingAssets = processedQtyInputArray.filter((item) => {
      return !assetCount.some((asset) => {
        return (
          asset.name === item.assetName &&
          asset.m_category_id === item.categoryId &&
          asset.m_cabang_id === item.branchAsset &&
          asset.m_status_condition_id === item.coditionAssetId
        );
      });
    });

    if (missingAssets.length > 0) {
      const missingAssetNames = missingAssets
        .map((item) => item.assetName)
        .join(", ");
      return res.status(400).send({
        message: `Asset ${missingAssetNames} di cabang Anda kosong untuk diTF`,
      });
    }

    // // Menghitung total selectQty dari seluruh objek dalam processedQtyInputArray
    const totalSelectQty = processedQtyInputArray.reduce(
      (total, item) => total + parseInt(item.selectQty),
      0
    );

    // // console.log("total select qty", totalSelectQty);

    if (totalSelectQty > assetCount.length) {
      return res.status(400).send({
        message: "Quantity melebihi jumlah yang tersedia",
      });
    }

    if (
      processedQtyInputArray.some(
        (item) =>
          item.assetId === undefined ||
          item.assetId === null ||
          item.selectQty === null ||
          item.selectQty === undefined ||
          item.selectQty === "0"
      )
    )
      return res.status(400).send({
        message: "Please fill in the quantity field",
      });

    // // // console.log("desc adalah", desc);

    const decsText = toTitleCase(desc);

    // // mencari slot kosong apakah tersedia
    for (const assetData of assetCount) {
      // Mencari permintaan transfer aktif untuk aset ini dalam m_trans_d
      const transDRetun = await db.m_trans_d.findOne({
        where: {
          m_asset_id: assetData.id,
          flag_active: true,
        },
      });

      if (transDRetun)
        return res.status(400).send({
          message: `Asset ${assetData.name} Already request Transfer`,
        });
    }

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const randomDigits = Math.floor(100 + Math.random() * 900);

    const no_transfer = `TF${branchOutId}${branchInId}${currentDate}${randomDigits}`;

    const transH = await db.m_trans_h.create({
      cabang_id_out: branchOutId,
      cabang_id_in: branchInId,
      desc: decsText,
      m_status_id: 1,
      no_transfer: no_transfer,
      date: new Date(date),
      user_id_penerima: userIdPenerima,
      createdBy: userId,
    });

    // console.log("Hasil transH:", transH.dataValues.id);
    const transHId = transH.dataValues.id;

    for (const data of processedQtyInputArray) {
      const { selectQty, assetName, coditionAssetId, categoryId } = data;
      // Temukan aset yang cocok dalam assetCount berdasarkan assetName dan coditionAssetId
      const matchingAssets = assetCount.filter((asset) => {
        return (
          asset.name === assetName &&
          asset.m_status_condition_id === coditionAssetId &&
          asset.m_category_id === categoryId
        );
      });

      // Ambil 'selectQty' jumlah 'm_asset_id' dari aset yang cocok
      const selectedAssetIds = matchingAssets
        .slice(0, parseInt(selectQty))
        .map((asset) => asset.id);

      console.log("selected asset", selectedAssetIds);
      // Membuat entri dalam tabel m_trans_d untuk setiap 'm_asset_id' yang dipilih
      for (const m_asset_id of selectedAssetIds) {
        const serialNumber = await db.m_assets_in.findOne({
          where: {
            m_form_id: 20,
            m_asset_id: m_asset_id,
          },
        });

        const numberPol = await db.m_assets_in.findOne({
          where: {
            m_form_id: 6,
            m_asset_id: m_asset_id,
          },
        });

        const sN = serialNumber ? serialNumber.dataValues.value : null;
        const numPol = numberPol ? numberPol.dataValues.value : null;

        await db.m_trans_d.create({
          m_trans_h_id: transHId,
          m_asset_name: assetName,
          m_asset_id: m_asset_id,
          m_category_id: categoryId,
          serial_number: sN,
          no_polisi: numPol,
          m_status_condition_id: coditionAssetId,
        });

        await db.m_assets.update(
          { relocation_status: true },
          { where: { id: m_asset_id } }
        );
      }
    }
    return res.status(200).send({
      message: "Transfer asset created successfully",
    });
  } catch (error) {
    console.log("error cratetransfer", error);
    return res.status(400).json({ message: error });
  }
}

async function createTransferAssetSpecialTool(req, res) {
  try {
    console.log("req body special tools", req.body);

    const {
      desc,
      fromBranch,
      toBranch,
      sN,
      category,
      assetName,
      assetId,
      date,
      recipient_name,
    } = req.body;

    const userId = parseInt(req.body.userId);
    const qty = parseInt(req.body.qty);
    const userIdPenerima = parseInt(req.body.userIdPenerima);

    if (
      category === "None" ||
      !category ||
      !desc ||
      !assetName ||
      !userIdPenerima ||
      !date
    )
      return res.status(400).send({ message: "Please Complete Your Data" });

    const decsText = toTitleCase(desc);

    const branch = await db.m_cabang.findOne({
      where: { cabang_name: toBranch },
    });

    const branch2 = await db.m_cabang.findOne({
      where: { cabang_name: fromBranch },
    });

    const branchInId = branch.dataValues.id;
    const branchOutId = branch2.dataValues.id;

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const randomDigits = Math.floor(100 + Math.random() * 900);

    const no_transfer = `TF${branchOutId}${branchInId}${currentDate}${randomDigits}`;

    const transH = await db.m_trans_h.create({
      cabang_id_out: branchOutId,
      cabang_id_in: branchInId,
      desc: decsText,
      m_status_id: 1,
      no_transfer: no_transfer,
      date: new Date(date),
      user_id_penerima: userIdPenerima,
      createdBy: userId,
    });

    const transHId = transH.dataValues.id;

    const categories = await db.m_categories.findOne({
      where: { name: category },
    });

    const categoryId = categories.dataValues.id;
    const trandD = await db.m_trans_d.create({
      m_trans_h_id: transHId,
      m_asset_name: assetName,
      m_asset_id: assetId,
      qty: qty,
      m_category_id: categoryId,
      serial_number: sN,
    });

    return res.status(200).send({
      message: "Transfer asset created successfully",
      //   asset: resAsset,
    });
  } catch (error) {
    console.log("error special tools", error);
    return res.status(400).json({ message: error });
  }
}

async function createTransferAssetStandardTool(req, res) {
  try {
    console.log("req body starndard Tool", req.body);

    const { desc, fromBranch, toBranch, category, assetName, assetId, date } =
      req.body;

    const userId = parseInt(req.body.userId);
    const qty = parseInt(req.body.qty);
    const userIdPenerima = parseInt(req.body.userIdPenerima);

    if (
      category === "None" ||
      !category ||
      !desc ||
      !assetName ||
      !userIdPenerima ||
      !date
    )
      return res.status(400).send({ message: "Please Complete Your Data" });

    const decsText = toTitleCase(desc);

    const branch = await db.m_cabang.findOne({
      where: { cabang_name: toBranch },
    });

    const branch2 = await db.m_cabang.findOne({
      where: { cabang_name: fromBranch },
    });

    const branchInId = branch.dataValues.id;
    const branchOutId = branch2.dataValues.id;

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const randomDigits = Math.floor(100 + Math.random() * 900);

    const no_transfer = `TF${branchOutId}${branchInId}${currentDate}${randomDigits}`;

    const transH = await db.m_trans_h.create({
      cabang_id_out: branchOutId,
      cabang_id_in: branchInId,
      desc: decsText,
      m_status_id: 1,
      no_transfer: no_transfer,
      date: new Date(date),
      user_id_penerima: userIdPenerima,
      createdBy: userId,
    });

    const transHId = transH.dataValues.id;

    const categories = await db.m_categories.findOne({
      where: { name: category },
    });

    const categoryId = categories.dataValues.id;
    const trandD = await db.m_trans_d.create({
      m_trans_h_id: transHId,
      m_asset_name: assetName,
      m_asset_id: assetId,
      qty: qty,
      m_category_id: categoryId,
    });

    return res.status(200).send({
      message: "Transfer asset created successfully",
      //   asset: resAsset,
    });

    //
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error });
  }
}

async function createTransferAssetSafetyTool(req, res) {
  try {
    console.log("req body starndard Tool", req.body);

    const { desc, fromBranch, toBranch, category, assetName, assetId, date } =
      req.body;

    const userId = parseInt(req.body.userId);
    const qty = parseInt(req.body.qty);
    const userIdPenerima = parseInt(req.body.userIdPenerima);

    if (
      category === "None" ||
      !category ||
      !desc ||
      !assetName ||
      !userIdPenerima ||
      !date
    )
      return res.status(400).send({ message: "Please Complete Your Data" });

    const decsText = toTitleCase(desc);

    const branch = await db.m_cabang.findOne({
      where: { cabang_name: toBranch },
    });

    const branch2 = await db.m_cabang.findOne({
      where: { cabang_name: fromBranch },
    });

    const branchInId = branch.dataValues.id;
    const branchOutId = branch2.dataValues.id;

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");

    const randomDigits = Math.floor(100 + Math.random() * 900);

    const no_transfer = `TF${branchOutId}${branchInId}${currentDate}${randomDigits}`;

    const transH = await db.m_trans_h.create({
      cabang_id_out: branchOutId,
      cabang_id_in: branchInId,
      desc: decsText,
      m_status_id: 1,
      no_transfer: no_transfer,
      date: new Date(date),
      user_id_penerima: userIdPenerima,
      createdBy: userId,
    });

    const transHId = transH.dataValues.id;

    const categories = await db.m_categories.findOne({
      where: { name: category },
    });

    const categoryId = categories.dataValues.id;
    const trandD = await db.m_trans_d.create({
      m_trans_h_id: transHId,
      m_asset_name: assetName,
      m_asset_id: assetId,
      qty: qty,
      m_category_id: categoryId,
    });

    return res.status(200).send({
      message: "Transfer asset created successfully",
      //   asset: resAsset,
    });

    //
  } catch (error) {
    console.log("error", error);
  }
}

async function confirmasiTransfer(req, res) {
  try {
    console.log("req.body tkonfirmasi transfer", req.body);

    const { userId, userBranchIdLogin, transHId, desc, statusSubmit } =
      req.body;

    if (!desc)
      return res.status(400).send({ message: "Please Complete your data" });

    const findStatus = await db.m_status.findOne({
      where: { status_name: statusSubmit },
    });

    if (!findStatus)
      return res.status(400).send({ message: "Status not found" });

    const statusIdConfirmed = findStatus.dataValues.id;
    // console.log("findStatus", findStatus);

    const decsText = toTitleCase(desc);

    const mTransH = await db.m_trans_h.findOne({
      where: {
        id: transHId,
      },
    });
    console.log("transH", mTransH.dataValues);

    const transD = await db.m_trans_d.findAll({
      attributes: ["id", "m_asset_id", "qty", "m_category_id", "m_trans_h_id"],
      where: { m_trans_h_id: transHId },
    });

    // console.log("trans d adlah", transD);

    const dataTransD = transD.map((data) => data.dataValues);
    const mAssetIds = transD.map((data) => data.dataValues.m_asset_id);
    const transDId = transD.map((data) => data.dataValues.id);

    // console.log("mAssetid", mAssetIds);
    // console.log("transDId", transDId);
    // console.log("dataTransD", dataTransD);

    const CabangIdIn = mTransH.dataValues.cabang_id_in;
    const CabangIdOut = mTransH.dataValues.cabang_id_out;
    const transhHId = mTransH.dataValues.id;
    const statusId = mTransH.dataValues.m_status_id;

    if (CabangIdIn !== userBranchIdLogin)
      return res.status(400).send({ message: "Branch mismatch" });

    if (statusId === 5 || statusId === 6)
      return res.status(400).send({ message: "Confirmation failed" });

    const mDetail = await db.m_trans_d.findOne({
      where: { m_trans_h_id: transhHId },
    });

    const assetId = mDetail.dataValues.m_asset_id;

    // console.log("ini detail", assetId);

    const updateTransH = await db.m_trans_h.update(
      {
        m_status_id: statusIdConfirmed,
        user_id_confirmation: userId,
        desc_received: decsText,
      },
      {
        where: {
          id: transhHId,
        },
      }
    );

    // status rejected
    if (statusIdConfirmed === 6) {
      for (const assetId of mAssetIds) {
        await db.m_assets.update(
          { m_cabang_id: CabangIdOut, relocation_status: false },
          { where: { id: assetId } }
        );
      }
      // status diterima
    } else if (statusIdConfirmed === 5) {
      for (const assetId of mAssetIds) {
        await db.m_assets.update(
          { m_cabang_id: CabangIdIn, relocation_status: false },
          { where: { id: assetId } }
        );
      }
    }

    for (const idTransD of transDId) {
      await db.m_trans_d.update(
        { flag_active: false },
        { where: { id: idTransD } }
      );
    }

    return res.status(200).send({
      message: "Thank you for your confirmation",
      //   asset: resAsset,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error });
  }
}

module.exports = {
  getTransAsset,
  createTransferAsset,
  createTransferAssetSpecialTool,
  createTransferAssetStandardTool,
  createTransferAssetSafetyTool,
  confirmasiTransfer,
};
