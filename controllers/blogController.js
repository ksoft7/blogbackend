import Blog from "../models/Blog.js";
import Joi from "joi";

// Blog validation schema
const blogValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  shortdesc: Joi.string().required(),
});

// Create a new blog post
export const createBlog = async (req, res) => {
  const { error } = blogValidationSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const blog = new Blog({
      title: req.body.title,
      description: req.body.description,
      shortdesc: req.body.shortdesc,
      imageUrl: req.file ? req.file.path : null,
    });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a comment to a blog
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.comments.push({ username: req.body.username, text: req.body.text });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
