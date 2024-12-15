import asyncHandler from 'express-async-handler';
import Comment from "../Models/CommentModel.js";
// Create a new comment
export const createComment = asyncHandler(async (req, res) => {
  const { movieId, text } = req.body;
  const userId = req.user._id;

  try {
    let newComment = await Comment.create({
      userId,
      movieId,
      text,
    });

    newComment = await Comment.findById(newComment._id).populate('userId', '_id fullName avatar');

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get comments for a specific movie
export const getComments = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const comments = await Comment.find({ movieId })
      .populate('userId', 'fullName avatar')
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .skip(skip)
      .limit(limit);

    const totalComments = await Comment.countDocuments({ movieId });

    res.status(200).json({
      comments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
