import mongoose from 'mongoose';

class ModelProxy {
  constructor(name, schemaDefinition, collectionName) {
    this.name = name;
    this.schemaDefinition = schemaDefinition;
    this.collectionName = collectionName;
    this._mongooseModel = null;
  }

  get model() {
    if (!this._mongooseModel) {
      // Build schema with standard options
      const schema = new mongoose.Schema(this.schemaDefinition, { 
        timestamps: true 
      });
      this._mongooseModel = mongoose.model(this.name, schema);
    }
    return this._mongooseModel;
  }

  // Proxy common mongoose methods used in our controllers
  find(query) {
    return this.model.find(query);
  }

  findOne(query) {
    return this.model.findOne(query);
  }

  findById(id) {
    return this.model.findById(id);
  }

  create(data) {
    return this.model.create(data);
  }

  findByIdAndUpdate(id, updateData, options) {
    return this.model.findByIdAndUpdate(id, updateData, options);
  }

  findByIdAndDelete(id) {
    return this.model.findByIdAndDelete(id);
  }

  countDocuments(query) {
    return this.model.countDocuments(query);
  }
}

export default ModelProxy;
