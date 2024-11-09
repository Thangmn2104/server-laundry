const BaseService = require('./base.service');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

class UserService extends BaseService {
    constructor() {
        super(User); 
    }

    register = async (userData) => {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Email already in use');
            }

            const newUser = await User.create(userData);
            const token = await this.generateToken(newUser);
            return {newUser , token};
        } catch (error) {
            throw new Error(error.message);
        }
    }

    completeRegisteratiom = async (_id, data) => {
        try {
            const userUpdated = await this.update(_id, data)
            if(userUpdated){
               const res =  await this.update(_id, { status: 'completed'}, { new: true})
               return res
            }else{
                throw new Error('Update user fail!');
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    login = async (email, password) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const isPasswordValid = await user.verifyPassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }

            const token = await this.generateToken(user);
            return { user, token };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    me = async (email) => {
        try {
            const user = await User.findOne({ email });
            
            if (!user) {
                throw new Error('User not found');
            }

            return user

        } catch (error) {
            
        }
    }

    forgetPassword = async (email) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const resetToken = await this.generateResetToken(user);

            user.resetToken = resetToken;
            await user.save();

            await this.sendResetEmail(user.email, resetToken);

            return { message: 'Reset token sent to email' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    resetPassword = async (token, newPassword) => {
        try {
            const user = await User.findOne({ resetToken: token });
            if (!user) {
                throw new Error('Invalid or expired token');
            }

            user.password = await this.hashPassword(newPassword);
            user.resetToken = null; // Clear the reset token
            await user.save();

            return { message: 'Password has been reset' };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    
    signCourse = async ({ids, courseId}) => {
        try {
            if(!ids){
                throw new Error('Ids is empty');
            }
            ids.forEach( async (id) => {
                
                await User.findOneAndUpdate({ _id: id },{ $addToSet: {
                    courseIds: courseId
                }},{ new: true})
            });
            return { message: 'Add student successfully!'}
        } catch (error) {
            throw new Error(error.message);
        }
    }

    // Helper methods
    generateToken = async (user) => {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';
    
        const payload = {
            email: user.email,
        };
        
        const options = {
            expiresIn: '6h', 
        };
        
        try {

            const token = await jwt.sign(payload, secretKey, options);
            return token;
        } catch (error) {
            throw new Error('Error generating token');
        }
    }

    generateResetToken = async (user) => {
        return 'reset-token';
    }

    decodeToken = async (token) => {
        try {
            let email = await jwt.decode(token)
            return email?.email
        } catch (error) {
            throw new Error('Unauthorized');
        }
    }

    sendResetEmail = async (email, resetToken) => {
        console.log(`Sending reset email to ${email} with token: ${resetToken}`);
    }

    hashPassword = async (password) => {
        return 'hashed-password';
    }
}

module.exports = new UserService();
