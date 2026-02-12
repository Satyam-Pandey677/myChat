import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import { CHAT } from "../modals/chatRouter.js";
import TryCatch from "../utils/TryCatch.js";

export const createNewChat = TryCatch(async(req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const {otherUserId} = req.body

    if(!otherUserId){
        res.status(400)
        .json({
            message:"Other user id is required"
        })

        return;
    }

    const existingChat = await CHAT.findOne({
        user:{$all:[userId],otherUserId, $size:2},
    })

    if(existingChat){
        res.json({
            message:"Chat already existed",
            chatId : existingChat._id,
        })
    }
})