import User from "../sql/models/User.js";

export default async function getFriend(req, res) {
    const user = await User.findOne({
        where: {
            username: req.body.user
        }
    })
    let arrFriends
    if(user){
        arrFriends= user.friends.split('.')
    }else{
        arrFriends=[]
    }
    
    if (arrFriends) {
        res.send(JSON.stringify(arrFriends))
    } else {
        res.send(JSON.stringify('Not'))
    }

}