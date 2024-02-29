const BinCategory = require('../models/BinCategory');
const User = require('../models/User');


exports.createBinCategory = async (req, res) => {
    try {
        const { userId, category } = req.body;
    // Find the user to get the role
    const user = await User.findById(userId);

    if (!user) {
    throw new Error('User not found');
    }

    // Check if the user's role is 'resident'
    if (user.roles !== 'resident') {
    throw new Error('Only residents are allowed to create bin categories');
    }

        // Create a new bin category
        const newBinCategory = new BinCategory({
            userId,
            category
        });

        // Save the bin category to the database
        await newBinCategory.save();

        // Query the saved bin category and populate the user's name
        const populatedBinCategory = await BinCategory.findById(newBinCategory._id)
            .populate('userId', 'name');

        res.status(201).json({ message: 'Bin category created successfully', binCategory: populatedBinCategory });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};



exports.getAllBinCategories = async (req, res) => {
    try {
        // Retrieve all bin categories from the database
        const binCategories = await BinCategory.find();

        res.status(200).json(binCategories);
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.getBinCategoryById = async (req, res) => {
    try {
        const binCategoryId = req.params.id;

        // Retrieve bin category by ID from the database
        const binCategory = await BinCategory.findById(binCategoryId);

        if (!binCategory) {
            return res.status(404).json({ message: 'Bin category not found' });
        }

        res.status(200).json(binCategory);
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.updateBinCategoryById = async (req, res) => {
    try {
        const binCategoryId = req.params.id;
        const { userId, category } = req.body;

        // Find the bin category by ID
        let binCategory = await BinCategory.findById(binCategoryId);

        if (!binCategory) {
            return res.status(404).json({ message: 'Bin category not found' });
        }

        // Update the bin category fields
        binCategory.userId = userId;
        binCategory.category = category;
      
      

        // Save the updated bin category to the database
        await binCategory.save();

        res.status(200).json({ message: 'Bin category updated successfully', binCategory });
    }catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

exports.deleteBinCategoryById = async (req, res) => {
    try {
        const binCategoryId = req.params.id;

        // Find the bin category by ID and delete it
        await BinCategory.findByIdAndDelete(binCategoryId);

        res.status(200).json({ message: 'Bin category deleted successfully' });
    } catch (err) {
        console.error('Error while handling database error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
