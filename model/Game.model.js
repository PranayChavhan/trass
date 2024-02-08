import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
        unique: [true, "Title Exist"],
      },
      description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        unique: [true, "Description Exist"],
      },
      features: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
      },
      trailer_video: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (value) => {
            return /^https?:\/\/.+$/.test(value);
          },
          message: "Invalid URL format for trailer video",
        },
      },
      game_image: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: (value) => {
            return /^https?:\/\/.+$/.test(value);
          },
          message: "Invalid URL format for game image",
        },
      },
      thumbnails: {
        type: [String],
        required: true,
        validate: {
          validator: (value) => value.every((url) => /^https?:\/\/.+$/.test(url)),
          message: "Invalid URL format for thumbnails",
        },
      },
      achievements: [{
        image: String,
        title: String,
        description: String
      }],
      system_requirements: {
        type: [String],
        required: true,
      },
      download_url: {
        type: String,
        required: true,
        validate: {
          validator: (value) => /^https?:\/\/.+$/.test(value),
          message: "Invalid URL format for download URL",
        },
      },
      play_url: {
        type: String,
        required: true,
        validate: {
          validator: (value) => /^https?:\/\/.+$/.test(value),
          message: "Invalid URL format for play URL",
        },
      },
      tags: {
        type: [String],
        required: true,
      },
      developers_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      }
});

const Game = mongoose.model("Game", gameSchema);

export default Game;
