import { builder, Builder } from "@builder.io/react";
import dynamic from "next/dynamic";

builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY);

Builder.registerComponent(
  dynamic(() => import("./components/Counter/Counter")),
  {
    name: "Counter",
  }
);

Builder.registerComponent(
  dynamic(() => import("./components/site/banner/bannercomponent")),
  {
    name: "Banner",
  }
);

Builder.registerComponent(
  dynamic(() => import("./components/site/footer/footercomponent")),
  {
    name: "Footer",
  }
);
