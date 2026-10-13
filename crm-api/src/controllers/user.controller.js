import * as userService from "../services/user.service.js";

export const getActiveExecutives = async (req, res) => {
  try {
    const executives = await userService.getActiveExecutives();
    return res.status(200).json({ success: true, data: executives });
  } catch (error) {
    console.error("Error in fetching executives: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch executives" });
  }
};
