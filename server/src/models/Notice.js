import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    file_url: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      required: true,
      enum: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
    },
    file_path: {
      type: String,
      required: true,
    },
    upload_date: {
      type: Date,
      default: Date.now,
    },
    expires_at: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform(_doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.file_path
        return ret
      },
    },
  },
)

noticeSchema.virtual('is_active').get(function isActive() {
  return this.expires_at > new Date()
})

export const Notice = mongoose.model('Notice', noticeSchema)
