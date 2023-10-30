const { toTitleCase } = require("../helper/loweUpperCase");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const sequelize = db.sequelize;
// const { Sequelize } = require("sequelize");

async function getTransReturn(req, res) {
  try {
    console.log("get trans return", req.query);
    const itemsPerPage = 6;
    const page = parseInt(req.query.page);

    const branchName = req.query.branchName;
    const branchId = parseInt(req.query.branchId);
    const roleUser = req.query.role;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    const branchIdClause =
      (roleUser === "Warehouse HO" && branchName === "HARMONI PUSAT") ||
      roleUser === "Super Admin"
        ? {}
        : branchId !== 17
        ? {
            cabang_id_out: branchId,
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
      mth.id, mth.no_return,
      mth.date, mth.user_id_penerima,
      mth.desc, mth.desc_received,
      mcIn.cabang_name cabang_out,
      mcIn.id id_cabang_out,
      mcOut.cabang_name cabang_in,
      mcOut.id id_cabang_in,
      mu.username user_transfer,
      mu_rec.username user_received,
      mscr.name status_return,
      ms.status_name
      FROM m_trans_h_return mth  
	LEFT JOIN m_cabang mcIn on mth.cabang_id_out = mcIn.id
    LEFT JOIN m_cabang mcOut on mth.destination = mcOut.id
    LEFT JOIN m_users mu on mth.createdBy = mu.id
    LEFT JOIN m_users mu_rec on mth.user_id_penerima = mu_rec.id
    LEFT JOIN m_status_condition mscr on mth.m_status_return_id = mscr.id
    LEFT JOIN m_status ms on mth.m_status_id = ms.id;`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const transD = await sequelize.query(
      `SELECT 
      mth.id transHId, mth.no_return,
      mtd.id,
      mtd.m_asset_name assetName,
      mtd.serial_number,
      mtd.no_polisi,
      mtd.m_status_condition,
      mc.name category_name,
      mo.name owner,
      count(*) as qty_stock
      FROM m_trans_h_return mth
      left join m_trans_d_return mtd on mth.id = mtd.m_trans_hr_id
      LEFT JOIN m_categories mctr on mtd.m_category_id = mctr.id
      left join m_status_condition msc on mtd.m_status_condition = msc.id
      left join m_owner mo on mtd.m_owner_id = mo.id
      LEFT JOIN m_categories mc on mtd.m_category_id = mc.id
      GROUP BY mtd.m_asset_name , mtd.m_category_id , mtd.m_status_condition
      HAVING count(*) > 0`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    // Menggabungkan data dari kedua kueri berdasarkan ID
    const returnAsset = transH.map((transHItem) => {
      const correspondingTransD = transD.filter(
        (transDItem) => transDItem.transHId === transHItem.id
      );
      return {
        ...transHItem,
        transD: correspondingTransD.length > 0 ? correspondingTransD : [],
      };
    });

    res.status(200).send({
      message: "SuccessFuly get data Return asset",
      returnAsset,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(400).json({ message: error });
  }
}

async function createReturnAsset(req, res) {
  try {
    console.log("ini create kendaraan return", req.body);
    const branchUserLogin = req.branchUser;
    const user = req.user;

    const { processedQtyInputArray, listTf, date, desc } = req.body;
    const statusReturnId = parseInt(req.body.statusReturnId);
    const userIdPenerima = parseInt(req.body.userIdPenerima);
    const fromBranch = req.body.fromBranch;
    const destination = parseInt(req.body.destination);
    const userId = parseInt(user.id);

    if (processedQtyInputArray.length !== listTf.length) {
      return res.status(400).send({
        message: "Please complete the quantity field or other fields",
      });
    }

    if (
      !desc ||
      !userIdPenerima ||
      !fromBranch ||
      !statusReturnId ||
      !destination ||
      !date
    )
      return res.status(400).send({ message: "Please Complete Your Data" });

    if (
      processedQtyInputArray.some(
        (item) => item.branchAsset !== branchUserLogin.id
      )
    )
      return res.status(400).send({
        message: "Branch asset or user branch is not valid",
      });

    if (destination !== 17)
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
      attributes: ["id", "id_karyawan", "username", "flag_active", "id_role"],
    });

    if (!userExist)
      return res.status(400).send({ message: "Recepitaine not found" });

    console.log("userexist return", userExist);

    const relCabangKaryawan = await db.rel_cabangkaryawan.findOne({
      where: {
        id_karyawan: userExist.dataValues.id_karyawan,
        flag_active: true,
      },
    });

    const branch = await db.m_cabang.findOne({
      where: { cabang_name: destination },
    });
    console.log("destination nih", branch);
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
    // console.log("branch receiptaine ", branchIdPic);

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

    const decsText = toTitleCase(desc);

    // mencari slot kosong apakah tersedia
    for (const assetData of assetCount) {
      // Mencari permintaan transfer aktif untuk aset ini dalam m_trans_d
      const transDRetun = await db.m_trans_d_return.findOne({
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

    console.log("random ", randomDigits);
    const no_return = `RT${branchOutId}${currentDate}${randomDigits}`;

    const transH = await db.m_trans_h_return.create({
      destination: destination,
      cabang_id_out: branchOutId,
      desc: decsText,
      m_status_id: 1,
      createdBy: userId,
      m_status_return_id: statusReturnId,
      date: date,
      // courier: courier,
      // m_owner_id: ownerId,
      user_id_penerima: userIdPenerima,
      no_return: no_return,
    });

    const transHId = transH.dataValues.id;

    for (const data of processedQtyInputArray) {
      const { selectQty, assetName, coditionAssetId, categoryId, ownerId } =
        data;
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

        await db.m_trans_d_return.create({
          m_trans_hr_id: transHId,
          m_asset_name: assetName,
          m_asset_id: m_asset_id,
          m_category_id: categoryId,
          serial_number: sN,
          no_polisi: numPol,
          m_status_condition_id: coditionAssetId,
          flag_active: true,
          m_status_condition: coditionAssetId,
          m_owner_id: ownerId,
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
    console.log("error", error);
    res.status(400).send(error);
  }
}

async function confirmasiReturn(req, res) {
  try {
    console.log("req.body tkonfirmasi return", req.roleName);
    console.log("req body confirmasi", req.body);

    // useuserBranchIdLogin = user login dari cabang mana
    const { userId, desc, statusSubmit } = req.body;
    const transHId = parseInt(req.body.transHId);
    const role = req.roleName;
    const user = req.user;
    const userBranchIdLogin = parseInt(req.body.userBranchIdLogin);

    console.log("userId karyawan", user.id);
    console.log("transH id", transHId);

    const relCabangKaryawan = await db.rel_cabangkaryawan.findOne({
      where: { id_karyawan: user.id_karyawan },
      attributes: ["id", "id_cabang", "id_karyawan"],
    });

    const branchId = relCabangKaryawan.dataValues.id_cabang;

    console.log("branchId", branchId);

    const cabang = await db.m_cabang.findOne({
      where: { id: branchId },
    });

    // console.log("branch adalah", cabang.dataValues);

    if (
      cabang.dataValues.cabang_name !== "HARMONI PUSAT" &&
      cabang.dataValues.cabang_name !== "CabangTesta" &&
      role !== "Warehouse HO"
    )
      return res.status(400).send({ message: "Cannot Access" });

    if (!desc)
      return res.status(400).send({ message: "Please Complete your data" });

    const findStatus = await db.m_status.findOne({
      where: { status_name: statusSubmit },
    });

    if (!findStatus)
      return res.status(400).send({ message: "Status not found" });

    const statusIdConfirmed = findStatus.dataValues.id;

    const decsText = toTitleCase(desc);

    const mTransH = await db.m_trans_h_return.findOne({
      where: {
        id: transHId,
      },
    });

    const transD = await db.m_trans_d.findAll({
      attributes: ["id", "m_asset_id", "qty", "m_category_id", "m_trans_h_id"],
      where: { m_trans_h_id: transHId },
    });

    const dataTransD = transD.map((data) => data.dataValues);
    const mAssetIds = transD.map((data) => data.dataValues.m_asset_id);
    const transDId = transD.map((data) => data.dataValues.id);

    const CabangIdIn = mTransH.dataValues.destination;
    const transhHId = mTransH.dataValues.id;
    const statusId = mTransH.dataValues.m_status_id;

    console.log("cabang id in", CabangIdIn);
    console.log("cabang login", userBranchIdLogin);

    if (CabangIdIn !== userBranchIdLogin)
      return res.status(400).send({ message: "Branch mismatch" });

    if (statusId === 5)
      return res.status(400).send({ message: "Confirmation failed" });

    // console.log("test trans hr", transhHId);

    const mDetails = await db.m_trans_d_return.findOne({
      where: { m_trans_hr_id: transhHId },
    });

    const assetId = mDetails.dataValues.m_asset_id;

    // console.log("ini detail");

    const updateTransH = await db.m_trans_h_return.update(
      {
        m_status_id: statusIdConfirmed,
        user_id_penerima: user.id,
        desc_received: decsText,
        flag_active: false,
        updatedBy: user.id,
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
          {
            m_cabang_id: CabangIdIn,
            relocation_status: false,
            updatedBy: user.id,
          },
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
  createReturnAsset,
  getTransReturn,
  confirmasiReturn,
};
