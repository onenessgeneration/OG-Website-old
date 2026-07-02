import vision from "@/assets/Home/Vision/vision.jpg";
import visionImg from "@/assets/Home/Vision/visionimage.jpg";
import img2950 from "@/assets/Home/Vision/IMG_2950.jpg";
import dsc from "@/assets/Home/Vision/DSC05413.jpg";
import gallery1 from "@/assets/Gallery/DJI_00001.jpg";
import gallery2 from "@/assets/Gallery/DSC07912.jpg";

// Ported from oneness-frontend/src/Components/Home/VisionImages.jsx.
// The old code shuffled 6 URLs from an API; we use the shipped assets.
const images = [vision, visionImg, img2950, dsc, gallery1, gallery2];

export default function VisionImages() {
  return (
    <div className="md:mt-6 mt-2">
      <div className="container mx-auto px-5 py-2 flex items-center">
        <div className="-m-1 flex flex-row sm:flex-wrap md:-m-2">
          <div className="flex w-full sm:w-1/2 flex-wrap lg:flex-row flex-row-reverse">
            {images.slice(0, 3).map((image, index) => (
              <div
                key={index}
                className={`${index === 2 ? "w-full" : "w-full lg:w-1/2"} p-1 md:p-2`}
              >
                <img
                  alt=""
                  className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                  src={image}
                />
              </div>
            ))}
          </div>
          <div className="flex w-full sm:w-1/2 flex-wrap">
            {images.slice(3, 6).map((image, index) => (
              <div
                key={index}
                className={`${index < 2 ? "w-1/2" : "w-full"} p-1 md:p-2`}
              >
                <img
                  alt=""
                  className="block h-full w-full rounded-lg 2xl:rounded-2xl object-cover object-center"
                  src={image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
