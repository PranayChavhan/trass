import GameModel from "../model/Game.model.js";

export async function addGame(req, res) {
  try {
    const {
      title,
      description,
      features,
      trailer_video,
      game_image,
      thumbnails,
      achievements,
      system_requirements,
      download_url,
      play_url,
      tags,
      developers_id,
    } = req.body;

    const existGameTitle = GameModel.findOne({ title });
    const existGameDescription = GameModel.findOne({ description });

    const [existingGameTitle, existingDescription] = await Promise.all([
      existGameTitle,
      existGameDescription,
    ]);

    if (existingGameTitle) {
      return res.status(400).json({ error: "Please use a unique game title" });
    }

    if (existingDescription) {
      return res
        .status(400)
        .json({ error: "Please use a unique game description" });
    }

    const newGame = new GameModel({
      title,
      description,
      features,
      trailer_video,
      game_image,
      thumbnails,
      achievements: [
        {
          image: achievements.image,
          title: achievements.title,
          description: achievements.description,
        },
      ],
      system_requirements,
      download_url,
      play_url,
      tags,
      developers_id,
    });

    const savedGame = await newGame.save();

    res.status(201).json({ msg: "Game added successfully", game: savedGame });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}


export async function getAllGames(req, res) {
  try {
    const games = await GameModel.find();

    res.status(200).json({ games });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}


export async function deleteGame(req, res) {
  try {
    const { gameId } = req.params;

    if (gameId) {
      GameModel.deleteOne({ _id: gameId }, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ msg: "Record Deleted...!" });
      });
    } else {
      return res.status(401).send({ error: "Game Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
