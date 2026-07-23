import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    meta: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    category: {
      type: String,
      required: true,
      enum: ['feedlot', 'mining'],
    },
    image_url: {
      type: String,
      required: true,
    },
    image_path: {
      type: String,
      required: true,
    },
    sort_order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.image_path
        return ret
      },
    },
  },
)

export const Project = mongoose.model('Project', projectSchema)
