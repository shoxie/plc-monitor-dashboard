import Lottie from "react-lottie";
import * as animationData from "../../lotties/528-spinner-loading.json";
import { Box } from "@chakra-ui/react";

const options = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export default function Loading() {
  return <Lottie options={options} height={400} />;
}
