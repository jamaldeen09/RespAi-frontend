import { LandingPage } from "@/components/landingPage/LandingPage";
import Loading from "@/components/reusable/Loading";
import React, { Suspense } from "react";

const page = (): React.ReactElement => {
  return (
    <Suspense fallback={<Loading />}>
      <LandingPage/>
    </Suspense>
  );
};

export default page;