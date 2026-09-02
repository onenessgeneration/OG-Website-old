import { useState } from "react";
import whoweare from "@/assets/About/whoweare.jpg";
import visionImg from "@/assets/About/vision.jpg";
import magicswitch from "@/assets/About/themagicswitch.jpg";
import onenessImg from "@/assets/About/onenessguidedbywisdom.jpg";
import { SiteImage } from "@/components/SiteMedia";

// Ported from oneness-frontend/src/Components/About/Vision.jsx.
// Each section image is CMS-managed via a `about/*` slot; the shipped assets
// are kept as defaults so the page still shows content pre-upload.
type Item = {
  title: string;
  subtitle: string;
  image: string;
  slotPath: string;
  link?: string;
  description: { description: string }[];
};

const contentData: Item[] = [
  {
    title: "Who We Are",
    subtitle: "The Oneness Generation",
    image: whoweare,
    slotPath: "about/whoweare.jpg",
    description: [
      { description: "Oneness Generation is founded by Sri Preethaji and Sri Krishnaji, enlightened leaders, and co-creators of the Oneness Movement." },
      { description: "Oneness Generation is a non-profit intiative of Oneness, driven by volunteers." },
      { description: "We are a community of young people who share a common passion - to live a life of connection, joy, and wholeness. " },
      { description: "We’re a movement for anyone who’s ready to shift out of stress and live life differently, in a calm, centered alpha brain state." },
      { description: "At OG, we know that life is better when it’s shared. So whether we’re doing a Soul Sync meditation, sharing stories, watching a movie or enjoying the present, we do it while supporting each other, celebrating each other, and enjoying being young, free, and connected." },
      { description: "We value our meditative moments and quiet time, but we also love frolicking in the sun, hanging out, and building meaningful connections that last a lifetime" },
      { description: "In our journey together, we explore what it means to be truly present and learn to bring peace and creativity into our everyday lives. " },
      { description: "We are more than a movement— we’re a place where you can be yourself, find your people, and create a life that feels genuinely stress-free." },
      { description: "We Love, Laugh, Create, and Connect, all while being Present, Spontaneous, and Free" },
    ],
  },
  {
    title: "Vision",
    subtitle: "Empowering Young Minds",
    image: magicswitch,
    slotPath: "about/magicswitch.jpg",
    description: [
      { description: "Empowering young people to break free of stress and find a calm, centered state of mind. We are a community of youth who work together to become free of the shackles of everyday stress and shift from a distressed beta state of mind (cause who likes that!) to a calm and centered alpha state. Our mission is to make stress-free living a reality for young people." },
    ],
  },
  {
    title: "The Magic Switch: Beta to Alpha",
    subtitle: "Transform Your State of Mind",
    image: visionImg,
    slotPath: "about/vision.jpg",
    description: [
      { description: "The beta brain wave state is where most of us spend much of our time. In beta, the brain operates at a fast frequency—13 to 30 Hz—and the mind becomes like a ‘monkey mind’: anxious, constantly swinging from one thought to another, distracted by every worry, task, or notification. Just like a monkey leaping from branch to branch, the mind in beta doesn’t rest; it keeps moving, searching for something to grab onto, but never settling down. This restless state keeps you feeling scattered and unfocused, often preventing you from fully engaging with life around you. Even with all the effort you put in, it’s hard to feel fulfilled, and life can seem like a treadmill, always moving but never arriving." },
      { description: "Now imagine there’s another ‘channel’ your brain can tune into—a calm, centered place where life slows down, and the mind settles. This is the alpha brain state. In alpha, the mind shifts to a slower, steadier frequency of 8 to 12 Hz. Here, the monkey mind quiets down, replaced by a deep, natural focus that lets you fully absorb and appreciate each moment. Life no longer feels like a race; instead, you’re present, peaceful, and open. In alpha, creativity flows, ideas present themselves, and challenges aren’t overwhelming. You are able to meaningfully engage with life" },
      { description: "Oneness Generation’s holistic approach empowers you to shift from the stress of the beta state to the calm, creative alpha state. Through a combination of transformative tools—wisdom teachings, Soul Sync, Serene Mind, and more—you’ll cultivate inner peace, clarity, and a deeper connection with yourself." },
    ],
  },
  {
    title: "Oneness",
    link: "https://www.ekam.org/",
    image: onenessImg,
    slotPath: "about/oneness.jpg",
    subtitle: "Guided by Wisdom",
    description: [
      { description: "To fulfil our vision, we seek guidance, spiritual wisdom, and insights from the Oneness movement. Oneness is a global movement in consciousness, founded by Sri Preethaji and Sri Krishnaji, with a presence in over 100 countries. This transformative spiritual movement has guided millions towards profound healing, a direct experience of their inner divinity, and the manifestation of awe-inspiring miracles." },
      { description: "Sri Preethaji and Sri Krishnaji, known as Mukti Gurus, are enlightened masters and philosophers of our time. Their teachings, rooted in original wisdom and mystic technology, have awakened countless individuals to a life of peace, connection, and oneness. Imagine the most radiant, effortlessly cool and serene person, and then amplify that by a hundred—that is Sri Krishnaji." },
    ],
  },
];

export default function Vision() {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleReadMore = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <div className="container mx-auto px-5">
      <div className="bg-tan">
        <div className="flex items-center justify-center">
          <span className="bg-white md:p-8 p-4 md:text-6xl font-normal text-xl font-black uppercase text-darkGrey backdrop-blur-lg">
            A movement, a generation of young people moving towards Oneness.
          </span>
        </div>

        <div className="md:space-y-10 space-y-5">
          {contentData.map((item, index) => {
            const combinedDescription = item.description.map((d) => d.description).join(" ");
            const isExpanded = expandedIndices.includes(index);
            const isEven = index % 2 === 0;

            const textBlock = (
              <div className={`md:w-1/2 ${isEven ? "order-2" : ""} lg:px-5 px-3 ${isEven ? "space-y-4" : "py-8 space-y-4"}`}>
                <h2 className="sm:text-5xl text-2xl w-full font-bold">{item.title}</h2>
                <p className="tracking-wide font-medium sm:text-2xl text-lg lg:leading-7">
                  {item.subtitle}
                </p>
                <p className="tracking-wide md:text-lg text-sm lg:leading-7 !text-darkGrey leading-loose">
                  {isExpanded ? combinedDescription : `${combinedDescription.slice(0, 400)}...`}
                  {combinedDescription.length > 400 && (
                    <button
                      className="text-brown underline ml-1"
                      onClick={() => toggleReadMore(index)}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </button>
                  )}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brown underline"
                  >
                    Link to oneness website
                  </a>
                )}
              </div>
            );

            const imageBlock = (
              <div className={`md:w-1/2 ${isEven ? "order-1 md:order-2" : ""}`}>
                <div className={isEven ? "p-3 lg:p-5" : ""}>
                  <SiteImage
                    path={item.slotPath}
                    defaultSrc={item.image}
                    alt={item.title}
                    fallbackAspect="4/3"
                    fallbackRounded="rounded-tr-lg rounded-bl-lg"
                    className="w-full md:rounded-tr-3xl md:rounded-bl-3xl rounded-tr-lg rounded-bl-lg lg:h-[500px] sm:h-[300px] h-[170px] object-cover"
                  />
                </div>
              </div>
            );

            return (
              <div key={index} className="md:flex flex-col md:flex-row w-full">
                {isEven ? (
                  <div className="w-full md:flex justify-center items-center md:p-10 p-5 container mx-auto px-5 md:gap-5 gap-3 text-[#b78036]">
                    {textBlock}
                    {imageBlock}
                  </div>
                ) : (
                  <div className="bg-tanAccent container mx-auto px-5 w-full md:p-10 p-5 md:flex md:gap-5 gap-3 justify-center items-center">
                    {imageBlock}
                    {textBlock}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
