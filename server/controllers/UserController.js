const UserModel = require("../models/UserModel");
const cloudinary = require("../config/cloudinary"); 

const UserController = {
  getProfile: async (req, res) => {
    try {
      const { nic } = req.user; // Extract NIC from JWT payload (added by AuthMiddleware)
      const user = await UserModel.getUserProfile(nic);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, user });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Failed to fetch user profile" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      
      const { nic } = req.user; // Extract NIC from JWT payload (added by AuthMiddleware)
      const updatedData = req.body;
      // Call the model to update the user details
      const result = await UserModel.updateUserProfile(nic, updatedData);

      if (!result) {
        return res.status(400).json({ success: false, message: "Update failed" });
      }

      res.status(200).json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Failed to update profile" });
    }
  },

  updateProfilePicture: async (req, res) => {
    try {
      const { nic } = req.user; // Extract NIC from JWT payload (added by AuthMiddleware)
      const { remove } = req.body; // Boolean to indicate whether to remove the image

      let newImageUrl = null;

      if (remove) {
        // Remove the image (set image_url to null)
        await UserModel.updateProfilePicture(nic, null);
        return res.status(200).json({ success: true, message: "Profile picture removed successfully" });
      }

      if (req.file) {
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "user_images",
        });
        newImageUrl = result.secure_url;
      }

      // Update the image URL in the database
      await UserModel.updateProfilePicture(nic, newImageUrl);

      res.status(200).json({ success: true, message: "Profile picture updated successfully", image_url: newImageUrl });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Failed to update profile picture" });
    }
  },

  getPaymentHistory: async (req, res) => {
    try {
      const { nic } = req.user; // Extract NIC from JWT payload (added by AuthMiddleware)

      // Call the model to get payment history
      const payments = await UserModel.getPaymentHistory(nic);

      res.status(200).json({ success: true, payments });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: "Failed to fetch payment history" });
    }
  }

};

module.exports = UserController;
