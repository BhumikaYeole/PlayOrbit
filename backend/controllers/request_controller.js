import PlayerRequest from "../models/player_request.js";
import Match from "../models/match.js";

export const sendJoinRequest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { matchId } = req.body;

    const match = await Match.findById(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Prevent creator sending request to own match
    if (match.createdBy.toString() === senderId) {
      return res.status(400).json({ message: "You are the match creator" });
    }

    // Prevent duplicate requests
    const existingRequest = await PlayerRequest.findOne({
      match: matchId,
      sender: senderId,
      status: "pending"
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = await PlayerRequest.create({
      match: matchId,
      sender: senderId,
      receiver: match.createdBy,
    });

    res.status(201).json(request);

  } catch (error) {
    res.status(500).json({ message: "Server error"  });
  }
};


export const getIncomingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await PlayerRequest.find({
      receiver: userId,
      status: "pending"
    })
      .populate("sender", "name email playerProfile")
      .populate("match");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const respondToRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestId } = req.params;
    const { action } = req.body; 

    const request = await PlayerRequest.findById(requestId)
      .populate("match");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    if (action === "accepted") {
      const match = await Match.findById(request.match._id);

      if (match.players.length >= match.maxPlayers) {
        return res.status(400).json({ message: "Match full" });
      }

      match.players.push(request.sender);

      if (match.players.length === match.maxPlayers) {
        match.status = "full";
      }

      await match.save();

      request.status = "accepted";
      await request.save();

      return res.json({ message: "Player added to match" });
    }

    if (action === "rejected") {
      request.status = "rejected";
      await request.save();
      return res.json({ message: "Request rejected" });
    }

    res.status(400).json({ message: "Invalid action" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSentRequests = async (req, res) => {
    try {
        const userId = req.user.id; 
        const requests = await PlayerRequest.find({
            sender: userId
        })
        .populate("receiver", "name email playerProfile")
        .populate("match"); 
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    } 
};
