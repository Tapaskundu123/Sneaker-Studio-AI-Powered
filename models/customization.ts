import mongoose from 'mongoose';

const CustomizationSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  customizations: mongoose.Schema.Types.Mixed,
  previewImage: String,
  tags: [String],
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Customization || mongoose.model('Customization', CustomizationSchema);