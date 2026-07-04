import { useRef, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import SliderModule from "react-slick";
import { ClientOnly } from "@/components/ClientOnly";

const Slider = ((SliderModule as unknown) as { default?: typeof SliderModule }).default ?? SliderModule;

// Ported from oneness-frontend/src/Components/Home/NewTestimonials.jsx.
// Uses static testimonial data until Supabase-backed testimonials wire in.

type Testimonial = {
  participant: string;
  location: string;
  tag: string;
  actualTestimonial: string;
  quotes: string;
  testimonialImageURL: string;
};

const testimonials: Testimonial[] = [
  {
    participant: "Nidhi Dev",
    location: "Pune, Maharastra",
    tag: "Testimonial",
    actualTestimonial:
      "It was when I truly saw myself as who I truly am, as a whole, not just what I pretend to be, in the external, did I become a better individual. Oneness Helped me actually See myself. When I can now see myself in face value, I can also see others and truly connect with them in a way I never thought possible.",
    quotes:
      "I would really, ardently love to find each one of you, reading this, experience this liberation, this joy, this bliss, as I have found in me.",
    testimonialImageURL:
      "https://api.dicebear.com/9.x/initials/svg?seed=Nidhi+Dev&backgroundColor=b78036&textColor=ffffff",
  },
  {
    participant: "Jordan Tan",
    location: "Malaysia",
    tag: "Testimonial",
    actualTestimonial:
      "A space for healing, transformation, and inner connection. I've learned to appreciate even the smallest things in life, and that has completely shifted my attitude toward life. The presence of the dasas, Sri Preethaji and Sri Krishnaji, the places, the teachings — all of it has been transformative.",
    quotes:
      "Oneness Generation brought healing and a new appreciation for life's simple joys.",
    testimonialImageURL:
      "https://api.dicebear.com/9.x/initials/svg?seed=Jordan+Tan&backgroundColor=cdad85&textColor=ffffff",
  },
  {
    participant: "Aarav Sharma",
    location: "Bengaluru, India",
    tag: "Testimonial",
    actualTestimonial:
      "Through this community I learned to slow down and breathe. The practices have given me a quiet centre I can return to whenever life gets loud. I am grateful for the friendships and the teachings that continue to shape me each day.",
    quotes: "A place that feels like home — gentle, expansive, and deeply transformative.",
    testimonialImageURL:
      "https://api.dicebear.com/9.x/initials/svg?seed=Aarav+Sharma&backgroundColor=605f4b&textColor=ffffff",
  },
  {
    participant: "Mei Lin",
    location: "Singapore",
    tag: "Testimonial",
    actualTestimonial:
      "Oneness Generation gave me tools to navigate stress with grace. The meditations are simple yet profound, and the community feels like family. I leave each session lighter and more present in my own life.",
    quotes: "A truly nourishing experience for the heart and mind.",
    testimonialImageURL:
      "https://api.dicebear.com/9.x/initials/svg?seed=Mei+Lin&backgroundColor=b78036&textColor=ffffff",
  },
];

const truncate = (text: string, charLimit: number) => {
  if (!text) return "";
  if (text.length <= charLimit) return text;
  const truncated = text.substring(0, charLimit);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace !== -1 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
};

export default function NewTestimonials() {
  const sliderRef = useRef<any>(null);
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const [expandedQuoteIndex, setExpandedQuoteIndex] = useState(-1);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full md:py-20 py-5 container mx-auto px-4">
      <div className="md:flex slider-container gap-1 space-y-3">
        <div className="grid space-y-4 md:w-1/4">
          <div className="md:space-y-10 space-y-4">
            <h2 className="text-lg bg-tan w-fit px-4 md:p-2 p-1 rounded-full font-semibold text-tanAccent border border-tanAccent">
              Testimonials
            </h2>
            <h2 className="text-2xl font-bold">
              What Our Awesome <br /> Participants Say
            </h2>
          </div>
          <div className="flex self-center gap-5">
            <div className="rounded-full hover:text-white hover:bg-tanAccent size-10 grid place-content-center place-items-center border bg-tan text-tanAccent">
              <button onClick={() => sliderRef.current?.slickPrev()} aria-label="Previous">
                <GoArrowLeft className="lg:text-2xl text-lg" />
              </button>
            </div>
            <div className="rounded-full hover:text-tan hover:bg-tanAccent size-10 grid place-content-center place-items-center border bg-tan text-tanAccent">
              <button onClick={() => sliderRef.current?.slickNext()} aria-label="Next">
                <GoArrowRight className="lg:text-2xl text-lg" />
              </button>
            </div>
          </div>
        </div>

        <Slider
          ref={(s) => {
            sliderRef.current = s;
          }}
          {...settings}
          className="relative overflow-hidden md:w-2/3"
        >
          {testimonials.map((d, index) => {
            const isExpanded = expandedIndex === index;
            const isQuoteExpanded = expandedQuoteIndex === index;
            return (
              <div key={index} className="md:px-10 px-2">
                <div className="relative bg-tan shadow-md rounded-lg flex flex-col md:p-6 p-3 md:space-y-4 space-y-2 h-full">
                  <div className="lg:absolute top-24 md:-left-10 -left-3 z-50">
                    <img
                      alt={`${d.participant}'s Image`}
                      src={d.testimonialImageURL}
                      className="size-20 rounded-full object-cover border-4 border-white bg-gray-400"
                    />
                  </div>

                  <div className="flex items-center md:space-x-4">
                    <div className="flex gap-2 items-center lg:pl-12">
                      <h3 className="lg:text-2xl text-md font-semibold text-gray-600">
                        {truncate(d.participant, 15)}
                      </h3>
                      <p className="text-sm text-gray-800">({truncate(d.location, 20)})</p>
                    </div>
                  </div>
                  <div className="lg:pl-12">
                    <p className="text-[11px] text-gray-500">{truncate(d.tag, 20)}</p>
                  </div>

                  <p className="text-gray-500 md:text-[12px] text-[11px] md:pl-12">
                    {isExpanded ? d.actualTestimonial : truncate(d.actualTestimonial, 250)}
                    {d.actualTestimonial.length > 250 && (
                      <button
                        onClick={() =>
                          setExpandedIndex((prev) => (prev === index ? -1 : index))
                        }
                        className="text-brown hover:underline ml-2"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>

                  <p className="text-gray-500 text-[12px] md:pl-12">
                    {isQuoteExpanded ? d.quotes : truncate(d.quotes, 200)}
                    {d.quotes.length > 200 && (
                      <button
                        onClick={() =>
                          setExpandedQuoteIndex((prev) => (prev === index ? -1 : index))
                        }
                        className="text-brown hover:underline ml-2"
                      >
                        {isQuoteExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
