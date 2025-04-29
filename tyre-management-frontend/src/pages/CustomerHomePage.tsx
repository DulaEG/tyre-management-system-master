import Footer from "@/components/common/Footer";
import NavBar from "@/components/common/Navbar";
import ItemContainer from "@/components/CustomerHomePage/ItemContainer";
import CustomerFeedbacks from "./CustomerFeedbacks";
import { useEffect } from "react";
import { sendReminderApi } from "@/api/sendReminderApi";

const CustomerHomePage = () => {
  useEffect(() => {
    if (localStorage.getItem("userId")) {
      console.log("User found");
      sendReminderApi();
    }
  }, []);

  return (
    <div className="w-screen">
      <NavBar />
      <section className="h-screen">
        <ItemContainer />
      </section>
      <CustomerFeedbacks />
      <Footer />
    </div>
  );
};

export default CustomerHomePage;
