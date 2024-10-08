import { Blog } from "../models/blog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from 'mongoose'; // Import mongoose for ObjectId validation

export const createBlog = asyncHandler(async (req, res) => {
    const { title, description, content, blogImage, tags, author, excerpt } = req.body;

    // Check for required fields
    if (!title || !description || !content || !tags || !author) {
        res.status(400);
        throw new Error("All required fields must be filled");
    }

    const blog = new Blog({
        title,
        description,
        content,
        blogImage,
        tags,
        author,
        excerpt,
    });

    const createdBlog = await blog.save();

    res.status(201).json({
        message: "Blog post created successfully",
        blog: createdBlog,
    });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({
        message: "All blog posts",
        blogs,
    });
});

export const getBlogs = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid blog ID");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    res.json({
        message: "Blog post",
        blog,
    });
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; // Use `id` instead of `_id`

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid blog ID");
    }

    const { title, description, content, blogImage, tags, excerpt } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.blogImage = blogImage || blog.blogImage;
    blog.tags = tags || blog.tags;
    blog.excerpt = excerpt || blog.excerpt;

    const updatedBlog = await blog.save();

    res.json({
        message: "Blog post updated successfully",
        blog: updatedBlog,
    });
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params; // Use `id` instead of `_id`

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error("Invalid blog ID");
    }

    const blog = await Blog.findById(id);

    if (!blog) {
        res.status(404);
        throw new Error("Blog post not found");
    }

    await blog.remove();

    res.json({
        message: "Blog post deleted successfully",
    });
});
