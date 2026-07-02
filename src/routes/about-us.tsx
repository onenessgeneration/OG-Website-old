import { createFileRoute } from "@tanstack/react-router";
import Vision from "@/components/about/Vision";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us — Oneness Generation" },
      {
        name: "description",
        content:
          "A movement, a generation of young people moving towards Oneness. Learn about our vision, the beta-to-alpha shift, who we are, and the wisdom of Oneness.",
      },
      { property: "og:title", content: "About Us — Oneness Generation" },
      {
        property: "og:description",
        content: "A movement, a generation of young people moving towards Oneness.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return <Vision />;
}
