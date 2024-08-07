import SectionLogin from "../components/organisms/SectionLogin";
import Img from "../components/atoms/Img";
function Login() {
    return(
        <>
        <div className=" border-solid bg-gradient-to-b h-[100vh] flex justify-center items-center bg-azullogin ">
        <div className="flex items-center p-2 space-x-2 ">
            <div>
                <Img image="Logo.png"></Img>
            </div>
            <div className="h-3/6">
            <div>
                <SectionLogin></SectionLogin>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}
export default Login