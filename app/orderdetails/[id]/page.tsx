import Navbar from "@/app/components/Navbar";
import OrderDetailsPage from "../../components/OrderDetailsPage";

const page = () => {
  return (
    <>
      <div>
        <Navbar />
      </div>
      <div>
        <OrderDetailsPage />
      </div>
    </>
  );
};

export default page;
