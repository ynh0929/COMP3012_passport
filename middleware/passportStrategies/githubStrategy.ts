import { Strategy as GitHubStrategy } from 'passport-github2';
import { PassportStrategy } from '../../interfaces/index';
import { database, userModel } from '../../models/userModel';
import { Request } from 'express';
import { Profile } from 'passport-github2';
import passport = require('passport');
import dotenv from 'dotenv';
dotenv.config();

interface GitHubProfile extends Profile {
    id: string;
    username: string;
    emails: { value: string }[];
}
console.log("GITHUB_CLIENT_ID:", process.env.GITHUB_CLIENT_ID || "Ov23liRK1aHD1SNCB8er");
console.log("GITHUB_CLIENT_SECRET:", process.env.GITHUB_CLIENT_SECRET || "2cae66a0443a70a224f31d23a9b78fdfdb4b0232");
console.log("GITHUB_CALLBACK_URL:", process.env.GITHUB_CALLBACK_URL || "http://localhost:8000/auth/github/callback");


const githubStrategy: GitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: process.env.GITHUB_CALLBACK_URL as string,
        passReqToCallback: true,
    },
    async (req: Request, accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: Express.User | null) => void) => {
        try {
            console.log("GitHub profile:", profile);
            if (!profile.username) {
                return done(new Error('No username found in profile'), null);
            }
        
            // let user = await userModel.findOne(profile.id);

            const user = {
                id: Number(profile.id),
                name: profile.username,
                email: "",
                password: "",
                role: 'user',
            };

            const foundUser = checkIfUserIsInDatabaseAlready(user.id);
           
            if(!foundUser){
                database.push(user);
                done(null, user);
            }
            else{
                done(null, foundUser);
            }


              // if (!user) {
            //     user = await userModel.create({
            //         name: profile.username,
            //         email: "",                    
            //         password: "", 
            //         role: 'user',
            //     });
            // }
            done(null, user);
        } catch (error) {
            done(error);
        }
    }
);

passport.use('github', githubStrategy);

const passportGitHubStrategy: PassportStrategy = {
    name: 'github',
    strategy: githubStrategy,
};

function checkIfUserIsInDatabaseAlready(id: number) {
    return database.find(user => user.id === id) || null;
}

export default passportGitHubStrategy;


