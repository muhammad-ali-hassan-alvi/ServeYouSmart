import Navbar from "@/app/components/Navbar";
import ProjectDetailsPage from "../../components/ProjectDetailsPage";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div className="mt-24">
        <ProjectDetailsPage />
      </div>
    </>
  );
};

export default page;
