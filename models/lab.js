const mongoose = require('mongoose')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const { type } = require('os')


const labSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        trim: true,
    },
    roomName: {
        type: String,
        required: true,
        trim: true
    },
    topic: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sem: {
        type: String,
    },
    dept: {
        type: String,
    },
    labStatus: {
        type: Boolean,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    students: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User" 
            },
            username: {
                type: String
            },
        }
    ],
    aproveStudents : [String],
    private: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Lab", labSchema)