import Data from "../models/DataModel.js";
import User from "../models/UsersModel.js";
import { Op } from "sequelize";

export const getData = async (req, res) => {
  try {
    let response;
    if (req.role === "admin") {
      response = await Data.findAll({
        attributes: ["uuid", "name", "company"],
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Data.findAll({
        attributes: ["uuid", "name", "company"],
        where: {
          userId: req.userId,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getDataById = async (req, res) => {
  try {
    const data = await Data.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak ditemukan" });
    let response;
    if (req.role === "admin") {
      response = await Data.findOne({
        attributes: ["uuid", "name", "company"],
        where: {
          id: data.id,
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    } else {
      response = await Data.findOne({
        attributes: ["uuid", "name", "company"],
        where: {
          [Op.and]: [{ id: data.id }, { userId: req.userId }],
        },
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
    }
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createData = async (req, res) => {
  const { name, company } = req.body;
  try {
    await Data.create({
      name: name,
      company: company,
      userId: req.userId,
    });
    res.status(201).json({ msg: "Data Created Succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateData = async (req, res) => {
  try {
    const data = await Data.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak ditemukan" });
    const { name, company } = req.body;
    if (req.role === "admin") {
      await Data.update(
        { name, company },
        {
          where: {
            id: data.id,
          },
        }
      );
    } else {
      if (req.userId !== data.userId)
        return res.status(403).json({ msg: "Akses Terlarang" });
      await Data.update(
        { name, company },
        {
          where: {
            [Op.and]: [{ id: data.id }, { userId: req.userId }],
          },
        }
      );
    }
    res.status(200).json({ msg: "Product Updated Succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteData = async (req, res) => {
  try {
    const data = await Data.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    if (!data) return res.status(404).json({ msg: "data tidak ditemukan" });
    const { name, company } = req.body;
    if (req.role === "admin") {
      await Data.destroy({
        where: {
          id: data.id,
        },
      });
    } else {
      if (req.userId !== data.userId)
        return res.status(403).json({ msg: "Akses Terlarang" });
      await Data.destroy({
        where: {
          [Op.and]: [{ id: data.id }, { userId: req.userId }],
        },
      });
    }
    res.status(200).json({ msg: "Product Deleted Succesfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
