import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tdmb.service.js";

export const searchPerson = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}`
    );
    // const response = await fetchFromTMDB(
    //   `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1`
    // );
    if (response.results.length === 0) {
      return res.status(404).send(null);
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.results[0].id,
          image: response.results[0].profile_path,
          title: response.results[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });
    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller : ", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: "Internal server Error in search Person controller.",
      });
  }
};
export const searchMovie = async (req, res) => {};
export const searchTV = async (req, res) => {};
export const getSearchHistory = async (req, res) => {};
export const removeItemFromHistory = async (req, res) => {};
