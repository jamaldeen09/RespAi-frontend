"use client"
import { Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link";
import React from "react";


type Social = "linkedin" | "github" | "twitter"
export const FooterSection = () => {
  const routeToSocial = (socialType: Social) => {
    const socialsMap: Map<Social, string> = new Map();
    const socialLinks: { social: Social; link: string }[] = [{
      social: "linkedin",
      link: "https://www.linkedin.com/in/jamaldeen-omotoyosi-10b137385/"
    }, {
      social: "github",
      link: "https://github.com/jamaldeen09"
    }, {
      social: "twitter",
      link: "https://x.com/leaf_papi"
    }];

    socialLinks.forEach((link) => socialsMap.set(link.social, link.link));

    const foundSocialLink = socialsMap.get(socialType);
    if (!foundSocialLink) return "#";

    return foundSocialLink;
  };

  const socialLinksUi: {
    id: number;
    icon: React.ReactElement;
    aria_label: string;
    type: Social;
  }[] = [
      {
        id: 1,
        icon: <Twitter className="w-full h-full text-muted-foreground" />,
        aria_label: "Twitter",
        type: "twitter",
      },
      {
        id: 2,
        icon: <Github className="w-full h-full text-muted-foreground" />,
        aria_label: "Github",
        type: "github"
      },
      {
        id: 3,
        icon: <Linkedin className="w-full h-full text-muted-foreground" />,
        aria_label: "Linkedin",
        type: "linkedin"
      }
    ];
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      {/* Left Section: Logo, Description, Social Links */}
      <div className="flex flex-col justify-start items-start gap-8 p-4 md:p-8">
        <div className="flex gap-3 items-stretch justify-center">
          <div className="text-center text-foreground text-xl font-semibold leading-4
          flex items-center gap-2">
            <div className="bg-background text-primary rounded-[50px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
              </svg>
            </div>
            RespAi
          </div>
        </div>
        <p className="text-foreground/90 text-sm font-medium leading-[25px] text-left w-full max-w-md">
          Stop guessing what your API is thinking. Get AI-powered insights that transform
          confusing errors into clear, actionable solutions
        </p>
        <div className="flex justify-start items-start gap-3">
          {socialLinksUi.map((socialLink) => (
            <Link
              key={socialLink.id}
              href={routeToSocial(socialLink.type)}
              aria-label={socialLink.aria_label}
              className="w-4 h-4 flex items-center justify-center"
            >
              {socialLink.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
