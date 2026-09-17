import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { initProcedureDetails } from "./procedure-details";

export const getRouter = () => {
  const queryClient = new QueryClient();

  // Explicitly initialize the procedure interaction. The project disables
  // package side effects, so a bare CSS/JS-style import can be tree-shaken.
  if (typeof window !== "undefined") initProcedureDetails();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
