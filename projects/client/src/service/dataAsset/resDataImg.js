import axios from "axios";

// id dari edit from dan details
const fetchImgByAssetId = async (id) => {
  console.log("test img", id);

  // const idAsset = editedAsset.id || id;
  const assetId = id;
  // console.log("edited img2", idAsset);

  try {
    const res = await axios.get(`http://localhost:2000/img/as`, {
      params: {
        idAsset: assetId,
      },
    });
    console.log("res img", res);
    return res;
  } catch (error) {
    console.log("error img", error);
  }
};

export { fetchImgByAssetId };
