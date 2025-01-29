import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { apiClient } from "@/lib/api-client";
import { getColors } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { FiEdit } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ProfileInfo = () => {
  const { userInfo, setUserInfo } = useAppStore();

  const navigate = useNavigate()

  const logOut = async () => {
    try {
        const response = await apiClient.post(LOGOUT_ROUTE, {}, {withCredentials: true})

        if(response.status === 200){
            setUserInfo(null)
            navigate('/auth')
        }
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-2 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {userInfo?.image ? (
                <AvatarImage
                src={`${HOST}/${userInfo?.image}`}
                alt="profile"
                className="object-cover w-full h-full bg-black"
                />
            ) : (
                <div
                className={`uppercase h-12 w-12 text-lg border-[1px] flex justify-center items-center ${getColors(
                    userInfo?.color
                )}`}
                >
                {userInfo?.firstName ? userInfo?.firstName.charAt(0) : userInfo?.email?.charAt(0)}
                </div>
            )}
            </Avatar>
        </div>
        <div>
            {
                userInfo?.firstName && userInfo?.lastName ? `${userInfo?.firstName} ${userInfo?.lastName}` : ''
            }
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="p-2">
                    <FiEdit className="text-purple-500 text-xl font-medium" onClick={() => navigate('/profile')} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                    Edit Profile
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="p-2">
                    <IoLogOut className="text-purple-500 text-xl font-medium" onClick={logOut} />
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                    Logout
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
