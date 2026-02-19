import Match from "../models/match.js";
import PlayerRequest from "../models/player_request.js";
import mongoose from "mongoose";

export const createMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sport, turfId, slotId, maxPlayers, message } = req.body;

        const match = await Match.create({
            sport,
            turf: turfId,
            slot: slotId,
            createdBy: userId,
            players: [userId],
            maxPlayers,
            message,
            date : new Date(),  
            status: "open"
        });

        console.log("Match created:", match);

        res.status(201).json(match);

    } catch (error) {
        res.status(500).json({ message: "Server error" + error.message });
    }
};



export const getMatchesByUserId = async (req, res) => {
    try {
        const userId = req.user.id;

        const matches = await Match.find({
            players: userId
        })
            .populate("turf", "name location")
            .populate("slot", "startTime endTime date");

        res.json(matches);

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllMatches = async (req, res) => {
    try {
        const matches = await Match.find()
            .populate("turf", "name location")
            .populate("slot", "startTime endTime date");
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



export const cancelMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { matchId } = req.params;

    const match = await Match.findById(matchId).session(session);

    if (!match) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Match not found" });
    }

    if (match.createdBy.toString() !== userId) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Only creator can cancel match" });
    }

    await PlayerRequest.deleteMany({ match: matchId }).session(session);

    await Match.findByIdAndDelete(matchId).session(session);

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Match deleted successfully" });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Cancel Match Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const leaveMatch = async (req, res) => {
    try {
        const userId = req.user.id;
        const { matchId } = req.params; 
        const match = await Match.findById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        if (!match.players.includes(userId)) {
            return res.status(400).json({ message: "You are not in this match" });
        }
        match.players = match.players.filter(playerId => playerId.toString() !== userId.toString());
        await match.save();
        res.json({ message: "Left match successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};