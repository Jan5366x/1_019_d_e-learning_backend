import {RoleM} from "./user/model"
import mongoose from "mongoose"

var checkDB: Function =  () => {
    RoleM.find({}).exec(function(err:any, roles:any){
        if(err) console.log(err.message); 
        if(roles.length<3){
            var student = new RoleM({
                _id: new mongoose.Types.ObjectId() ,
                name: "student"
            }).save()
            var teacher = new RoleM({
                _id: new mongoose.Types.ObjectId() ,
                name: "teacher"
            }).save()
            var admin = new RoleM({
                _id: new mongoose.Types.ObjectId() ,
                name: "admin"
            }).save()
            
        }
        
    })
}

module.exports = { checkDB }