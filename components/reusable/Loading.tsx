import React from "react";
import { Spinner } from "../ui/spinner";

const Loading = (): React.ReactElement => {
  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Spinner className="size-5 text-primary" />
    </div>
  );
};

export default Loading;