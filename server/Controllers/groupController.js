// controllers/groupController.js

import { Group } from "../Models/Group.js";


// CREATE GROUP
export const createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;

    let members = req.body.members || [];

    // Convert single member to array
    if (!Array.isArray(members)) {
      members = [members];
    }

    const group = await Group.create({
      groupName,
      admin: req.user._id,
      members: [...new Set([req.user._id.toString(), ...members])],
      groupImage: req.file
        ? `/uploads/group/${req.file.filename}`
        : "",
    });

    const populatedGroup = await Group.findById(group._id)
      .populate("admin", "username profileImage")
      .populate("members", "username profileImage");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL GROUPS OF LOGGED-IN USER
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user.id,
    })
      .populate("admin", "username")
      .populate("members", "username");

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE GROUP
export const getSingleGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("admin", "username")
      .populate("members", "username");

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ADD MEMBER
export const addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (!group.members.includes(memberId)) {
      group.members.push(memberId);
      await group.save();
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    group.members = group.members.filter(
      member => member.toString() !== memberId
    );

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LEAVE GROUP
export const leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    group.members = group.members.filter(
      member => member.toString() !== req.user.id
    );

    await group.save();

    res.status(200).json({
      message: "Left group successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE GROUP
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can delete group",
      });
    }

    await Group.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Group (name and/or image)
export const updateGroup = async (req, res) => {
  try {
    const { groupName } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        message: "Group not found",
      });
    }

    // Only admin can update the group
    if (group.admin.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Only admin can update the group",
      });
    }

    // Update group name
    if (groupName && groupName.trim()) {
      group.groupName = groupName.trim();
    }

    // Update group image
    if (req.file) {
      group.groupImage = `/uploads/group/${req.file.filename}`;
    }

    await group.save();

    const updatedGroup = await Group.findById(group._id)
      .populate("admin", "username profileImage")
      .populate("members", "username profileImage");

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    console.error("Update Group Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};