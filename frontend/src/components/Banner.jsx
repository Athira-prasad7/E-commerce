import React from "react";
import bannerImg from "../assets/banner.jpg";
function Banner() {
    return (
        <div className="w-full">
            <img
              src={bannerImg}
              alt="Shop Banner"
              className="w-full h-100 mt-16 mb-2 "
            />
        </div>
    );
}

export default Banner;