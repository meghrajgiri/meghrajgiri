"use client";

import { Button } from "../Button";
import { Paragraph } from "../typography";

const navbarItems = ["Experiences", "Project", "Tools", "Testimonials", "Faqs"];

const Navbar = () => {
  return (
    <nav className="fixed left-0 top-0 z-10 w-full bg-transparent">
      <div className="mx-auto mt-7 flex max-w-[900px] items-center justify-between rounded-full border border-white-20 bg-white-100 py-5 pl-8 pr-5 shadow-none shadow-[#BEC3CF]">
        <div className="flex items-center space-x-2">
          <div className="text rounded-full text-2xl font-bold text-primary">
            Meghraj.
          </div>
        </div>
        <div className="hidden space-x-3 md:flex">
          {navbarItems.map((item) => (
            <div
              key={item}
              className="cursor-pointer rounded-lg p-2 transition-all duration-300 ease-in-out hover:bg-white-20"
            >
              <Paragraph
                text={item}
                weight="regular"
                className="text-secondary"
                variant="small"
              />
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <Button size="md" variant="primary" text="Get Resume" />
          {/* <button className="text-4xl" onClick={toggleTheme}>
            {theme === "dark" ? "🌚" : "🌞"}
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
