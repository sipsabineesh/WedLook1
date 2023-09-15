const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

      bannerTitle: {
        type: String,
        required: true,
      },
      bannerImage: {
        type: Array,
      },
      bannerLink: {
        type: String,
        required: true,
      },
      isActive:
      {
        type: Boolean,
        default: false,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
    
})

module.exports = mongoose.model('banner',bannerSchema)