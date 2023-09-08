import express from "express";
import {
  getData,
  getDataById,
  updateData,
  createData,
  deleteData,
} from "../controllers/Data.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/data", verifyUser, getData);
router.get("/data/:id", verifyUser, getDataById);
router.post("/data", verifyUser, createData);
router.patch("/data/:id", verifyUser, updateData);
router.delete("/data/:id", verifyUser, deleteData);

export default router;
