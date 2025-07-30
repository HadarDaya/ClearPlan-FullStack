/**
 * This component serves as the landing page of the application.
 * Contains a welcome message, app description, and a Lottie animation.
 */
import Lottie from "lottie-react";
import checklistAnimation from "../../assets/lottie/Checklist.json";

/**
 * Homepage component shown at the root route ('/').
 */
export default function HomePage() {
  return (
    <div className="px-4 mt-20">
      <div className="bg-white/20 rounded-3xl backdrop-blur-sm py-2 px-6 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-20">
          {/* Text content */}
          <div className="text-center md:text-left md:max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-montserrat-bold leading-tight whitespace-nowrap">
              Welcome to ClearPlan
            </h1>
            <p className="text-xl md:text-2xl text-white/80">
              Manage your projects and tasks efficiently.
              <br />
              Sign up or log in to get started.
            </p>
          </div>

          {/* Lottie animation */}
          <div className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px]">
            <Lottie
              animationData={checklistAnimation}
              loop
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
