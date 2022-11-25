export function removeID() {
  return {
    transform: function(_, ret) {
      delete ret.__v
      delete ret._id
    }
  }
}

export const nextID = async(dbModel) => await dbModel.countDocuments({}) + 1