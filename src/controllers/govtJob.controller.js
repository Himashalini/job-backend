import { GovtJobModel } from "../models/govtJob.model.js";

export const getGovtJobs = async (req, res) => {
  const { search } = req.query;
  const jobs = await GovtJobModel.getAll(search);
  res.json(jobs);
};

export const createGovtJob = async (req, res) => {
  await GovtJobModel.create(req.body);
  res.status(201).json({ message: "Government job created" });
};

export const updateGovtJob = async (req, res) => {
  await GovtJobModel.update(req.params.id, req.body);
  res.json({ message: "Government job updated" });
};

export const deleteGovtJob = async (req, res) => {
  await GovtJobModel.delete(req.params.id);
  res.json({ message: "Government job deleted" });
};