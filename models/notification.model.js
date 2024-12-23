const mongoose = require('mongoose');
const { Schema } = mongoose; 


const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: true
    },
    teacherData: {
        type: {
            userId: String,
            userName: String
        },  
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean, 
        default: false, 
    },
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Notification', notificationSchema);
