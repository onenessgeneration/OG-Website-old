import { createFileRoute } from "@tanstack/react-router";
import Banner from "@/components/home/Banner";
import Vision from "@/components/home/Vision";
import VisionImages from "@/components/home/VisionImages";
import UpcomingEventCard from "@/components/home/UpcomingEventCard";
import NewTestimonials from "@/components/home/NewTestimonials";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oneness Generation — What is Oneness Generation?" },
      {
        name: "description",
        content:
          "Empowering youth to break free of stress and find a calm, joyful state of mind.",
      },
      { property: "og:title", content: "Oneness Generation" },
      {
        property: "og:description",
        content:
          "A community of young people helping each other move from stress to a calm, centered state.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Banner />
      <Vision />
      <VisionImages />
      <UpcomingEventCard />
      <NewTestimonials />
    </>
  );
}
