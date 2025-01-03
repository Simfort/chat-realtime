import User from "../sql/models/User.js"

export default async function addFriend(req, res) {
    const user = await User.findOne({
        where: {
            username: req.body.user
        }
    })
    const arrFriend = user.friends.split('.')
    if (arrFriend.length >= 1) {
        await User.update(
            { friends: `${user.friends}.${req.body.friend}` },
            {
                where: {
                    username: req.body.user
                }
            }
        )
        const friend = await User.findOne({
            where: {
                username: req.body.friend
            }
        })
        await User.update(
            { friends: `${friend.friends}.${req.body.user}` },
            {
                where: {
                    username: req.body.friend
                }
            }
        )
        res.send(JSON.stringify('Your are friends!'))
    }
    res.send(JSON.stringify('no'))
}